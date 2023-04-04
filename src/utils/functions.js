import axios from "axios";

import { ONEMAP_API_GET_TOKEN_ENDPOINT, USER_AGENT } from "../constants.js";

export const getOneMapApiToken = async () => {
  const email = process.env.ONEMAP_API_EMAIL;
  const password = process.env.ONEMAP_API_PASSWORD;

  if (!email || !password) {
    throw new Error("OneMap email or password not found");
  }

  const body = { email, password };

  const res = await axios.post(ONEMAP_API_GET_TOKEN_ENDPOINT, body, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data["access_token"];
};

export const getBluesgApiToken = async () => {
  const authHeader = process.env.BLUESG_BASIC_AUTH_HEADER;

  if (!authHeader) {
    throw new Error("Missing auth header");
  }

  const body = "grant_type=client_credentials";
  const options = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": USER_AGENT,
      Accept: "application/json; text/plain, */*",
      Authorization: authHeader,
      "Content-Length": body.length,
      Origin: "https://membership.bluesg.com.sg",
    },
  };

  const res = await axios.post(
    "https://api.bluesg.com.sg/oauth2/token/",
    body,
    options
  );
  const { access_token, token_type } = res.data;
  return { authHeader: `${token_type} ${access_token}` };
};
