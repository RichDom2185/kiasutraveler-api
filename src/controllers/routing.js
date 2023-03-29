import axios from "axios";
import L from "polyline-encoded";

const ONEMAP_API_ROUTING_ENDPOINT =
  "https://developers.onemap.sg/privateapi/routingsvc/route";

// Fixed to be 5 by API requirement
const COORDINATE_PRECISION = 5;

export const ROUTE_TYPE_WALK = "walk";
export const ROUTE_TYPE_DRIVE = "drive";
export const ROUTE_TYPE_PUBLIC_TRANSPORT = "pt";
export const ROUTE_TYPE_CYCLING = "cycle";

export const getWaypointsStandard = async (
  token,
  startLat,
  startLng,
  endLat,
  endLng,
  routeType
) => {
  const params = {
    start: `${startLat},${startLng}`,
    end: `${endLat},${endLng}`,
    routeType,
    token,
  };
  const res = await axios.get(ONEMAP_API_ROUTING_ENDPOINT, { params });

  // From https://www.onemap.gov.sg/docs/#decoding-route_geometry
  const encoded = res.data["route_geometry"];
  if (encoded !== undefined || encoded !== "" || encoded != null) {
    const latlngs = L.decode(encoded, {
      precision: COORDINATE_PRECISION,
    });

    return {
      // Need to convert to [longitude, latitude]
      waypoints: [
        [startLng, startLat],
        ...latlngs.map(latlng => latlng.reverse()),
        [endLng, endLat],
      ],
      directions: res.data["route_instructions"],
    };
  }
  return { error: "Something went wrong." };
};

export const TRANSIT_MODE_TRANSIT = "TRANSIT";
export const TRANSIT_MODE_BUS = "BUS";
export const TRANSIT_MODE_RAIL = "RAIL";
export const TRANSIT_MODES = [
  TRANSIT_MODE_BUS,
  TRANSIT_MODE_RAIL,
  TRANSIT_MODE_TRANSIT,
];

export const getWaypointsWithDateTimeTransport = async (
  token,
  startLat,
  startLng,
  endLat,
  endLng,
  routeType,
  date, // MM-DD-YYYY
  time, // HH:MM:SS
  transitMode,
  maxWalkDistance, // optional. TODO: Implement
  numItineraries // number of results between [1, 3], optional. TODO: Implement
) => {
  const params = {
    start: `${startLat},${startLng}`,
    end: `${endLat},${endLng}`,
    routeType,
    token,
    date,
    time,
    mode: transitMode,
  };
  const res = await axios.get(ONEMAP_API_ROUTING_ENDPOINT, { params });

  // return res.data;

  const data = res.data;
  const routes = data.plan.itineraries;
  const responseData = routes.map(({ duration, legs }) => {
    const parsedLegs = legs.map(
      ({
        startTime,
        endTime,
        mode,
        route,
        from: { name: fromStopName, stopCode: fromStopCode },
        to: { name: toStopName, stopCode: toStopCode },
        legGeometry: { points: encoded },
      }) => {
        // From https://www.onemap.gov.sg/docs/#decoding-route_geometry
        const latlngs = L.decode(encoded, {
          precision: COORDINATE_PRECISION,
        });
        return {
          startTimeUtc: startTime % 86400,
          endTimeUtc: endTime % 86400,
          mode,
          route,
          fromStopName,
          fromStopCode,
          toStopName,
          toStopCode,
          // Need to convert to [longitude, latitude]
          waypoints: latlngs.map(latlng => latlng.reverse()),
        };
      }
    );

    return { duration, legs: parsedLegs };
  });

  return { itineraries: responseData };
};
