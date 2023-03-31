import express from "express";
import {
  getAddressesFromCoordinates,
  getCoordinatesFromAddress,
} from "../controllers/geocode.js";
import { errorBadRequest, errorUnprocessableEntity } from "../utils/errors.js";
import { getOneMapApiToken } from "../utils/functions.js";

const router = express.Router();

router.get("/forward", (req, res) => {
  const { address, maxCount } = req.query;
  if (!address) {
    errorBadRequest(res);
    return;
  }
  const args = [address];
  if (maxCount) {
    args.push(maxCount);
  }
  getCoordinatesFromAddress(...args).then(data => res.json(data));
});

router.get("/reverse", (req, res) => {
  getOneMapApiToken().then(token => {
    let { lat, lng } = req.query;
    if (!lat || !lng) {
      errorBadRequest(res);
      return;
    }
    try {
      lat = parseFloat(lat);
      lng = parseFloat(lng);
    } catch (e) {
      errorUnprocessableEntity(res);
      return;
    }
    // TODO: Use `maxDistance` param
    getAddressesFromCoordinates(token, lat, lng).then(data => res.json(data));
  });
});

export default router;
