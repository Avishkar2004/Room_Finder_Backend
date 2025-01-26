import express from "express";
const router = express.Router();
import { getAllFlats } from "../controllers/flatController.js";

// Route to get all flats
router.get("/flats", getAllFlats);

export default router;
