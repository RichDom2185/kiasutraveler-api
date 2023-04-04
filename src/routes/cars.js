import express from "express";

import {
  getAvailableBluesgVehicles,
  getAvailableGetgoVehicles,
} from "../controllers/cars.js";
import { errorBadRequest, errorUnprocessableEntity } from "../utils/errors.js";
import { getBluesgApiToken } from "../utils/functions.js";

const router = express.Router();

router.get("/", (req, res) => {
  const { serviceType } = req.query;
  if (!serviceType) {
    errorBadRequest(res);
    return;
  }
  switch (serviceType) {
    // TODO: Replace with constants
    case "getgo":
      getAvailableGetgoVehicles().then(data => res.json(data));
      return;
    case "bluesg":
      getBluesgApiToken().then(({ authHeader }) => {
        getAvailableBluesgVehicles(authHeader).then(data => res.json(data));
      });
      return;
    default:
      errorUnprocessableEntity(res);
      return;
  }
});

export default router;
