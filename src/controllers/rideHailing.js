import axios from "axios";

import { GRAB_ENDPOINT_URL, USER_AGENT } from "../constants.js";

export const RIDE_HAILING_TYPE_GRAB = "grab";
export const RIDE_HAILING_SERVICES = [RIDE_HAILING_TYPE_GRAB];

export const getAvailableGrabServices = async (
  startLat,
  startLng,
  endLat,
  endLng
) => {
  const body = {
    pickUp: { latitude: startLat, longitude: startLng },
    dropOff: { latitude: endLat, longitude: endLng },
  };
  const options = {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "application/json; text/plain, */*",
      "Content-Length": JSON.stringify(body).length,
      Origin: "https://www.grab.com",
      Referer: "https://www.grab.com/sg/fare-check/",
    },
  };

  const res = await axios.post(GRAB_ENDPOINT_URL, body, options);
  const { services } = res.data;
  const parsedServices = services.map(
    ({
      serviceName,
      eta,
      fare: { maxFare: fareMax, minFare: fareMin },
      surgeNotice: surgePricing,
      ett,
    }) => {
      return { name: serviceName, eta, ett, fareMin, fareMax, surgePricing };
    }
  );

  return { services: parsedServices };
};
