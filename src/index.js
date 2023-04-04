import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

import geocodeRouter from "./routes/geocode.js";
import rideHailingRouter from "./routes/rideHailing.js";
import routingRouter from "./routes/routing.js";
import trafficRouter from "./routes/traffic.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  res.send("Hello from kiasutraveler API!");
});

app.use("/geocode", geocodeRouter);
app.use("/ride_hailing", rideHailingRouter);
app.use("/routes", routingRouter);
app.use("/traffic", trafficRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
