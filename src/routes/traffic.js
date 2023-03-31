import express from "express";
import { LTA_DATAMALL_API_KEY } from "../constants.js";
import { getTrafficIncidents } from "../controllers/traffic.js";

const router = express.Router();

router.get("/incidents", (req, res) => {
  getTrafficIncidents(LTA_DATAMALL_API_KEY).then(data => res.json(data));
});

export default router;
