import axios from "axios";

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
  return res.data;
};
