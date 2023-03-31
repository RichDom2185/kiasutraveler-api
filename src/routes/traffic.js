import express from "express";
import { LTA_DATAMALL_API_KEY } from "../constants.js";
import {
  getTrafficDensityBus,
  getTrafficIncidents,
} from "../controllers/traffic.js";
import { errorBadRequest, errorUnprocessableEntity } from "../utils/errors.js";

const router = express.Router();

router.get("/incidents", (req, res) => {
  getTrafficIncidents(LTA_DATAMALL_API_KEY).then(data => res.json(data));
});

router.get("/density", (req, res) => {
  const { type } = req.query;
  if (!type) {
    errorBadRequest(res);
    return;
  }
  switch (type) {
    case "bus":
      getTrafficDensityBus(LTA_DATAMALL_API_KEY).then(data => res.json(data));
      return;
    default:
      errorUnprocessableEntity(res);
      return;
  }
});

export default router;
