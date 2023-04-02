import axios from "axios";

const ONEMAP_API_SEARCH_ENDPOINT =
  "https://developers.onemap.sg/commonapi/search";

// https://www.onemap.gov.sg/docs/#search
export const getCoordinatesFromAddress = async (
  address,
  maxNumOfResults = 8
) => {
  const params = {
    searchVal: address,
    returnGeom: "Y",
    getAddrDetails: "Y",
  };

  const res = await axios.get(ONEMAP_API_SEARCH_ENDPOINT, { params });
  const results = res.data["results"];
  return {
    results: results
      .slice(0, maxNumOfResults)
      .map(({ SEARCHVAL, BLK_NO, ROAD_NAME, POSTAL, LATITUDE, LONGITUDE }) => {
        return {
          name: SEARCHVAL,
          block: BLK_NO,
          roadName: ROAD_NAME,
          postalCode: POSTAL,
          lat: parseFloat(LATITUDE),
          lng: parseFloat(LONGITUDE),
        };
      }),
  };
};

const ONEMAP_API_REVERSE_GEOCODE_ENDPOINT =
  "https://developers.onemap.sg/privateapi/commonsvc/revgeocode";

// https://www.onemap.gov.sg/docs/#reverse-geocode-wgs84
export const getAddressesFromCoordinates = async (
  token,
  latitude,
  longitude,
  maxDistance = 10 // In metres. Must be between [0, 500]
) => {
  const params = {
    location: `${latitude},${longitude}`,
    token,
    buffer: maxDistance,
    otherFeatures: "Y",
  };

  const res = await axios.get(ONEMAP_API_REVERSE_GEOCODE_ENDPOINT, { params });
  const buildings = res.data["GeocodeInfo"];

  return {
    results: buildings.map(
      ({ BUILDINGNAME, BLOCK, ROAD, POSTALCODE, LATITUDE, LONGITUDE }) => {
        return {
          name: BUILDINGNAME,
          block: BLOCK,
          roadName: ROAD,
          postalCode: POSTALCODE,
          lat: parseFloat(LATITUDE),
          lng: parseFloat(LONGITUDE),
        };
      }
    ),
  };
};
