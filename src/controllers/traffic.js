import axios from "axios";

const LTA_DATAMALL_TRAFFIC_INCIDENTS_ENDPOINT =
  "http://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents";

export const getTrafficIncidents = async token => {
  const options = {
    headers: {
      AccountKey: token,
    },
  };
  const res = await axios.get(LTA_DATAMALL_TRAFFIC_INCIDENTS_ENDPOINT, options);

  const incidents = res.data["value"];

  return {
    // count: incidents.length,
    incidents: incidents.map(({ Type, Latitude, Longitude, Message }) => {
      return {
        type: Type,
        lat: Latitude,
        lng: Longitude,
        details: Message,
      };
    }),
  };
};
