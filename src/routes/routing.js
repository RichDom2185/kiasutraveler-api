import express from "express";

import {
  getWaypointsStandard,
  getWaypointsWithDateTimeTransport,
  ROUTE_TYPE_CYCLING,
  ROUTE_TYPE_DRIVE,
  ROUTE_TYPE_PUBLIC_TRANSPORT,
  ROUTE_TYPE_WALK,
  TRANSIT_MODES,
} from "../controllers/routing.js";
import { getOneMapApiToken } from "../utils/functions.js";

const router = express.Router();

router.get("/", (req, res) => {
  getOneMapApiToken().then(token => {
    let { startLat, startLng, endLat, endLng } = req.query;
    const { mode } = req.query;
    if (!startLat || !startLng || !endLat || !endLng || !mode) {
      res.status(400);
      res.json({ error: "Bad Request" });
      return;
    }
    try {
      startLat = parseFloat(startLat);
      startLng = parseFloat(startLng);
      endLat = parseFloat(endLat);
      endLng = parseFloat(endLng);
    } catch (e) {
      res.status(422);
      res.json({ error: "Unprocessable Entity" });
      return;
    }
    switch (mode) {
      case ROUTE_TYPE_CYCLING:
      case ROUTE_TYPE_DRIVE:
      case ROUTE_TYPE_WALK:
        getWaypointsStandard(
          token,
          startLat,
          startLng,
          endLat,
          endLng,
          mode
        ).then(data => res.json(data));
        return;
      case ROUTE_TYPE_PUBLIC_TRANSPORT:
        const { date, time, vehicleType, maxWalkDistance, numItineraries } =
          req.query;
        if (!date || !time || !vehicleType) {
          res.status(422);
          res.json({ error: "Unprocessable Entity" });
          return;
        }
        // TODO: Validate correct date and time formats
        if (!TRANSIT_MODES.includes(vehicleType)) {
          res.status(422);
          res.json({ error: "Unprocessable Entity" });
          return;
        }
        getWaypointsWithDateTimeTransport(
          token,
          startLat,
          startLng,
          endLat,
          endLng,
          mode,
          date,
          time,
          vehicleType,
          maxWalkDistance,
          numItineraries
        ).then(data => res.json(data));
        return;
      default:
        res.status(422);
        res.json({ error: "Unprocessable Entity" });
        break;
    }
  });
});

export default router;
