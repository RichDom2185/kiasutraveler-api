import express from "express";

import { getRainfallData, getWeatherForecast } from "../controllers/weather.js";

const router = express.Router();

router.get("/forecast", (req, res) => {
  const { date, time } = req.query;
  // TODO: Validate date and time are YYYY-MM-DD and HH:mm:ss
  //       respectively, if they are provided.
  // Undefined is fine, as that will just return the current data
  getWeatherForecast(date, time).then(data => res.json(data));
});

router.get("/rainfall", (req, res) => {
  const { date, time } = req.query;
  // TODO: Validate date and time are YYYY-MM-DD and HH:mm:ss
  //       respectively, if they are provided.
  // Undefined is fine, as that will just return the current data
  getRainfallData(date, time).then(data => res.json(data));
});

export default router;
