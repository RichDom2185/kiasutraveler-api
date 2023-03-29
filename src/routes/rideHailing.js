import axios from "axios";
import express from "express";

import { GRAB_ENDPOINT_URL, USER_AGENT } from "../constants.js";

const router = express.Router();

const availableServiceTypes = ["grab"];

router.get("/", (req, res) => {
  const { serviceType } = req.query;
  if (!availableServiceTypes.includes(serviceType)) {
    res.status(400);
    res.json({ message: "Invalid service type" });
    return;
  }

  const body = {
    pickUp: { latitude: 1.3557467791, longitude: 103.9871103 },
    dropOff: { latitude: 1.2943507656757305, longitude: 103.77389728148182 },
  };
  const options = {
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      "Accept-Encoding": "gzip, deflate, br",
      Accept: "application/json; text/plain, */*",
      "Content-Length": 133,
      Origin: "https://www.grab.com",
      Referer: "https://www.grab.com/sg/fare-check/",
    },
  };
  axios
    .post(GRAB_ENDPOINT_URL, body, options)
    .then(response => {
      const data = response.data;
      res.json(data);
    })
    .catch(err => {
      res.status(err.status);
      res.json({ message: "Something went wrong." });
    });
});

export default router;
