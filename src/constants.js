import * as dotenv from "dotenv";

dotenv.config();

export const GRAB_ENDPOINT_URL =
  "https://www.grab.com/wp-json/api/farefeed/v1/estimate";
export const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36";

export const ONEMAP_API_GET_TOKEN_ENDPOINT =
  "https://developers.onemap.sg/privateapi/auth/post/getToken";

export const LTA_DATAMALL_API_KEY = process.env.LTA_DATAMALL_API_KEY;
