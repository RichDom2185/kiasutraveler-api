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
import { errorBadRequest, errorUnprocessableEntity } from "../utils/errors.js";
import { getOneMapApiToken } from "../utils/functions.js";

const router = express.Router();

router.get("/", (req, res) => {
  getOneMapApiToken().then(token => {
    let { startLat, startLng, endLat, endLng } = req.query;
    const { mode } = req.query;
    if (!startLat || !startLng || !endLat || !endLng || !mode) {
      errorBadRequest(res);
      return;
    }
    try {
      startLat = parseFloat(startLat);
      startLng = parseFloat(startLng);
      endLat = parseFloat(endLat);
      endLng = parseFloat(endLng);
    } catch (e) {
      errorUnprocessableEntity(res);
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
          errorUnprocessableEntity(res);
          return;
        }
        // TODO: Validate correct date and time formats
        if (!TRANSIT_MODES.includes(vehicleType)) {
          errorUnprocessableEntity(res);
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
        errorUnprocessableEntity(res);
        break;
    }
  });
});

export default router;
