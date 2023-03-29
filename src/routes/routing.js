import express from "express";

import { getWaypoints } from "../controllers/routing.js";
import { getOneMapApiToken } from "../utils/functions.js";

const router = express.Router();

router.get("/", (req, res) => {
  getOneMapApiToken().then(token => {
    let { startLat, startLng, endLat, endLng } = req.query;
    const { mode } = req.query;
    try {
      startLat = parseFloat(startLat);
      startLng = parseFloat(startLng);
      endLat = parseFloat(endLat);
      endLng = parseFloat(endLng);
    } catch (e) {
      res.status(422);
      res.json({ error: "Unprocessable Entity" });
    }
    getWaypoints(token, startLat, startLng, endLat, endLng, mode).then(data =>
      res.json(data)
    );
  });
});

export default router;
