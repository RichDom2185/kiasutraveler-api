import express from "express";
import { LTA_DATAMALL_API_KEY } from "../constants.js";
import {
  MRT_LINE_ALL,
  MRT_LINE_BPL,
  MRT_LINE_CCL,
  MRT_LINE_CEL,
  MRT_LINE_CGL,
  MRT_LINE_DTL,
  MRT_LINE_EWL,
  MRT_LINE_NEL,
  MRT_LINE_NSL,
  MRT_LINE_PLRT,
  MRT_LINE_SLRT,
  getTrafficDensityAllPlatforms,
  getTrafficDensityBus,
  getTrafficDensityPlatform,
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
    case "platform":
      const { mrt } = req.query;
      if (!mrt) {
        errorBadRequest(res);
        return;
      }
      switch (mrt) {
        case MRT_LINE_CCL:
        case MRT_LINE_CEL:
        case MRT_LINE_CGL:
        case MRT_LINE_DTL:
        case MRT_LINE_EWL:
        case MRT_LINE_NEL:
        case MRT_LINE_NSL:
        case MRT_LINE_BPL:
        case MRT_LINE_SLRT:
        case MRT_LINE_PLRT:
          getTrafficDensityPlatform(LTA_DATAMALL_API_KEY, mrt).then(data =>
            res.json(data)
          );
          return;
        case MRT_LINE_ALL:
          getTrafficDensityAllPlatforms(LTA_DATAMALL_API_KEY).then(data =>
            res.json(data)
          );
          return;
        default:
          errorUnprocessableEntity(res);
          return;
      }

    default:
      errorUnprocessableEntity(res);
      return;
  }
});

export default router;
