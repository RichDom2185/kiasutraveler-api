import express from "express";
import { getWaypoints } from "../controllers/routing.js";

import { getOneMapApiToken } from "../utils/functions.js";

const router = express.Router();

router.get("/", (req, res) => {
  getOneMapApiToken().then(token => {
    console.log(token);
    getWaypoints(token).then(data => res.json(data));
  });
});

export default router;
