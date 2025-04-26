import express from "express";
import { createArea } from "../controller/area_controller.js";

const router = express.Router();

router.post("/add", createArea);

export default router;
