import axios from "axios";

import { USER_AGENT } from "../constants.js";

const GETGO_CARS_AVAILABILITY_ENDPOINT =
  "https://getgo.sg/dataitems/vehicles.json";

export const getAvailableGetgoVehicles = async () => {
  const res = await axios.get(GETGO_CARS_AVAILABILITY_ENDPOINT);
  const { data } = res.data;
  return {
    data: data.map(
      ({
        plate_number,
        num_seats,
        latitude,
        longitude,
        postal_code,
        vehicle_make_name,
        vehicle_model_name,
        price_per_hour,
        mileage_price,
      }) => {
        return {
          vehicleNo: plate_number,
          vehicleName: `${vehicle_make_name} ${vehicle_model_name}`.trim(),
          capacity: num_seats,
          lat: latitude,
          lng: longitude,
          postalCode: postal_code,
          pricePerHour: price_per_hour,
          pricePerMile: mileage_price,
        };
      }
    ),
  };
};

const BLUESG_CARS_AVAILABILITY_ENDPOINT =
  "https://api.bluesg.com.sg/v2/station/?filter=cars";

export const getAvailableBluesgVehicles = async authHeader => {
  const options = {
    headers: {
      "User-Agent": USER_AGENT,
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "application/json; text/plain, */*",
      Authorization: authHeader,
      Origin: "https://membership.bluesg.com.sg",
    },
  };
  const res = await axios.get(BLUESG_CARS_AVAILABILITY_ENDPOINT, options);
  const { results } = res.data;

  return {
    stations: results.map(
      ({
        lat,
        lng,
        address,
        postal_code,
        // TODO: Find out the difference between below three:
        cars,
        slots,
        charge_slots,
        // TODO: Evaluate usefulness and meaning of below:
        rental_status,
        charging_status,
        subscription_status,
        kind,
      }) => {
        return {
          lat,
          lng,
          address,
          postalCode: postal_code,
          numCars: cars,
          numSlots: slots,
          numChargeSlots: charge_slots,
          rentalStatus: rental_status,
          chargingStatus: charging_status,
          subscriptionStatus: subscription_status,
          kind,
        };
      }
    ),
  };
};
