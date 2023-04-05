import express from "express";

import { getRainfallData } from "../controllers/weather.js";

const router = express.Router();

router.get("/rainfall", (req, res) => {
  const { date, time } = req.query;
  // TODO: Validate date and time are YYYY-MM-DD and HH:mm:ss respectively
  // Undefined is fine, as that will just return the current data
  getRainfallData(date, time).then(data => res.json(data));
});

export default router;
