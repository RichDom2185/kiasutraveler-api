import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

import rideHailingRouter from "./routes/rideHailing.js";
import routingRouter from "./routes/routing.js";

const app = express();
const port = process.env.PORT ?? 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/routes", routingRouter);
app.use("/ride_hailing", rideHailingRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  const body = {
    pickUp: { latitude: 1.3557467791, longitude: 103.9871103 },
    dropOff: { latitude: 1.2943507656757305, longitude: 103.77389728148182 },
  };
  console.log(JSON.stringify(body).length);
});
