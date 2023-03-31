import express from "express";

const router = express.Router();

router.get("/forward", (req, res) => {
  res.send("Forward");
});

router.get("/reverse", (req, res) => {
  res.send("Reverse");
});

export default router;
