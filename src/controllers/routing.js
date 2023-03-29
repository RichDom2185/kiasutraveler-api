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
  from = "1.3557467791,103.9871103",
  to = "1.2943507656757305,103.77389728148182",
  routeType = ROUTE_TYPE_DRIVE
) => {
  const params = {
    start: from,
    end: to,
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

    // Do something with latlngs
    return {
      // Need to convert to [longitude, latitude]
      // FIXME: Remove string hardcoding
      // TODO: Add destination waypoint
      waypoints: [
        from
          .split(",")
          .reverse()
          .map(s => parseFloat(s)),
        ...latlngs.map(latlng => latlng.reverse()),
      ],
      directions: res.data["route_instructions"],
    };
  }
  return { error: "Something went wrong." };
};
