import axios from "axios";

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
