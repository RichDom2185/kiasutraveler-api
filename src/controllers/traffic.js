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

const LTA_DATAMALL_TRAFFIC_DENSITY_PLATFORM_ENDPOINT =
  "http://datamall2.mytransport.sg/ltaodataservice/PCDRealTime";

// From https://datamall.lta.gov.sg/content/dam/datamall/datasets/LTA_DataMall_API_User_Guide.pdf
export const MRT_LINE_ALL = "all"; // Special value
export const MRT_LINE_CCL = "CCL";
export const MRT_LINE_CEL = "CEL";
export const MRT_LINE_CGL = "CGL";
export const MRT_LINE_DTL = "DTL";
export const MRT_LINE_EWL = "EWL";
export const MRT_LINE_NEL = "NEL";
export const MRT_LINE_NSL = "NSL";
export const MRT_LINE_BPL = "BPL";
export const MRT_LINE_SLRT = "SLRT";
export const MRT_LINE_PLRT = "PLRT";
export const MRT_LINES = [
  // do not include MRT_LINE_ALL
  MRT_LINE_CCL,
  MRT_LINE_CEL,
  MRT_LINE_CGL,
  MRT_LINE_DTL,
  MRT_LINE_EWL,
  MRT_LINE_NEL,
  MRT_LINE_NSL,
  MRT_LINE_BPL,
  MRT_LINE_SLRT,
  MRT_LINE_PLRT,
];

// From https://datamall.lta.gov.sg/content/dam/datamall/datasets/LTA_DataMall_API_User_Guide.pdf
const CROWD_LEVEL_LOW = "l";
const CROWD_LEVEL_MODERATE = "m"; // Not used
const CROWD_LEVEL_HIGH = "h"; // Not used
const CROWD_LEVEL_NA = "na"; // Not used

export const getTrafficDensityPlatform = async (token, mrtLine) => {
  const headers = { AccountKey: token };
  const params = {
    TrainLine: mrtLine,
  };
  const res = await axios.get(LTA_DATAMALL_TRAFFIC_DENSITY_PLATFORM_ENDPOINT, {
    headers,
    params,
  });

  const crowds = res.data["value"];

  return {
    // List of all stations queried
    stations: crowds.map(({ Station }) => Station),
    // List of stations with crowd alerts
    crowds: crowds
      // Only returns stations with non-low crowding to save bandwidth
      .filter(({ CrowdLevel }) => CrowdLevel !== CROWD_LEVEL_LOW)
      .map(({ Station, CrowdLevel }) => {
        return {
          code: Station,
          crowdLevel: CrowdLevel,
        };
      }),
  };
};

export const getTrafficDensityAllPlatforms = async token => {
  const allStations = [];
  const allCrowds = [];
  for (const mrtLine of MRT_LINES) {
    const { stations, crowds } = await getTrafficDensityPlatform(
      token,
      mrtLine
    );
    allStations.push(...stations);
    allCrowds.push(...crowds);
  }
  return {
    stations: allStations,
    crowds: allCrowds,
  };
};
