import AdmZip from "adm-zip";
import axios from "axios";

const LTA_DATAMALL_TRAFFIC_INCIDENTS_ENDPOINT =
  "http://datamall2.mytransport.sg/ltaodataservice/TrafficIncidents";

export const getTrafficIncidents = async token => {
  const headers = { AccountKey: token };
  const res = await axios.get(LTA_DATAMALL_TRAFFIC_INCIDENTS_ENDPOINT, {
    headers,
  });

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

const LTA_DATAMALL_TRAFFIC_DENSITY_BUS_ENDPOINT =
  "http://datamall2.mytransport.sg/ltaodataservice/PV/Bus";

export const getTrafficDensityBus = async (token, date) => {
  const headers = { AccountKey: token };
  const res = await axios.get(LTA_DATAMALL_TRAFFIC_DENSITY_BUS_ENDPOINT, {
    headers,
  });

  // Links for zip files containing the data
  const links = res.data["value"].map(({ Link }) => Link);
  const csvs = [];
  await Promise.all(
    links.map(async link => {
      const zipResponse = await axios.get(link, {
        responseType: "arraybuffer",
      });

      const zip = new AdmZip(zipResponse.data);
      const files = zip.getEntries();
      files.forEach(file => csvs.push(zip.readAsText(file)));
    })
  );

  return {
    data: csvs,
  };
};
