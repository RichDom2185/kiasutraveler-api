import express from "express";

import {
  getAvailableGrabServices,
  RIDE_HAILING_SERVICES,
} from "../controllers/rideHailing.js";
import { errorUnprocessableEntity } from "../utils/errors.js";

const router = express.Router();

router.get("/", (req, res) => {
  let { startLat, startLng, endLat, endLng } = req.query;
  const { serviceType } = req.query;
  if (!startLat || !startLng || !endLat || !endLng || !serviceType) {
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
    errorUnprocessableEntity(res);
    return;
  }
  if (!RIDE_HAILING_SERVICES.includes(serviceType)) {
    errorUnprocessableEntity(res);
    return;
  }

  getAvailableGrabServices(startLat, startLng, endLat, endLng).then(data =>
    res.json(data)
  );
});

export default router;
