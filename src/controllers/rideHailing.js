import axios from "axios";

import { USER_AGENT } from "../constants.js";

export const RIDE_HAILING_TYPE_GRAB = "grab";
export const RIDE_HAILING_SERVICES = [RIDE_HAILING_TYPE_GRAB];

const GRAB_AVAILABLE_SERVICES_ENDPOINT =
  "https://www.grab.com/wp-json/api/farefeed/v1/estimate";

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

  const res = await axios.post(GRAB_AVAILABLE_SERVICES_ENDPOINT, body, options);
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
