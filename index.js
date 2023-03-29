import express from "express";
const app = express();
const port = process.env.PORT ?? 3000;

import axios from "axios";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const availableServiceTypes = ["grab"];
const GRAB_ENDPOINT_URL =
  "https://www.grab.com/wp-json/api/farefeed/v1/estimate";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36";

app.get("/fare-estimates", (req, res) => {
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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  const body = {
    pickUp: { latitude: 1.3557467791, longitude: 103.9871103 },
    dropOff: { latitude: 1.2943507656757305, longitude: 103.77389728148182 },
  };
  console.log(JSON.stringify(body).length);
});
