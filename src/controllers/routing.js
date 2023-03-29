import axios from "axios";
import L from "polyline-encoded";

const ONEMAP_API_ROUTING_ENDPOINT =
  "https://developers.onemap.sg/privateapi/routingsvc/route";

export const ROUTE_TYPE_WALK = "walk";
export const ROUTE_TYPE_DRIVE = "drive";
export const ROUTE_TYPE_PUBLIC_TRANSPORT = "pt";
export const ROUTE_TYPE_CYCLING = "cycle";

export const getWaypoints = async (
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
      precision: 5,
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
