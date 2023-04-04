import express from "express";
import { getAvailableGetgoVehicles } from "../controllers/cars.js";

const router = express.Router();

router.get("/", (req, res) => {
  getAvailableGetgoVehicles().then(data => res.json(data));
});

export default router;
