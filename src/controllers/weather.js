import axios from "axios";

const DATA_GOV_RAINFALL_ENDPOINT =
  "https://api.data.gov.sg/v1/environment/rainfall";

export const getRainfallData = async (date, time) => {
  const params = {
    date: date && !time ? date : undefined,
    date_time: date && time ? `${date}T${time}` : undefined,
  };
  const res = await axios.get(DATA_GOV_RAINFALL_ENDPOINT, { params });
  const {
    metadata: { stations, reading_type, reading_unit },
    items,
  } = res.data;
  return {
    readingType: reading_type,
    readingUnit: reading_unit,
    stations: stations.map(
      ({ id, name, location: { latitude, longitude } }) => {
        return {
          id,
          name,
          lat: latitude,
          lng: longitude,
        };
      }
    ),
    data: items.map(({ timestamp, readings }) => {
      return {
        timestamp,
        readings: readings.map(({ station_id, value }) => {
          return {
            id: station_id,
            value,
          };
        }),
      };
    }),
  };
};
