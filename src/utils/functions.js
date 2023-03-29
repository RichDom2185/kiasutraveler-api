import axios from "axios";

import { ONEMAP_API_GET_TOKEN_ENDPOINT } from "../constants.js";

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
