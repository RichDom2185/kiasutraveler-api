import express from "express";

import {
  getAvailableGrabServices,
  getAvailableTaxis,
  RIDE_HAILING_TYPE_GRAB,
  RIDE_HAILING_TYPE_TAXI,
} from "../controllers/rideHailing.js";
import { errorBadRequest, errorUnprocessableEntity } from "../utils/errors.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { serviceType } = req.query;
  if (!serviceType) {
    errorBadRequest(res);
    return;
  }
  switch (serviceType) {
    case RIDE_HAILING_TYPE_GRAB:
      let { startLat, startLng, endLat, endLng } = req.query;
      if (!startLat || !startLng || !endLat || !endLng) {
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
      getAvailableGrabServices(startLat, startLng, endLat, endLng).then(data =>
        res.json(data)
      );
      return;
    case RIDE_HAILING_TYPE_TAXI:
      getAvailableTaxis().then(data => res.json(data));
      return;
    default:
      errorUnprocessableEntity(res);
      return;
  }
});

export default router;
