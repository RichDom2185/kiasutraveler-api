import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

import geocodeRouter from "./routes/geocode.js";
import rideHailingRouter from "./routes/rideHailing.js";
import routingRouter from "./routes/routing.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/routes", routingRouter);
app.use("/ride_hailing", rideHailingRouter);
app.use("/geocode", geocodeRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
