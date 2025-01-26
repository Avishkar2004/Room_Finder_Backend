import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Import this to define __dirname in ESM
import authRoutes from "./routes/authRoutes.js";
import flatsRoutes from "./routes/PostflatsRoutes.js";
import GetflatRoutes from "./routes/GetflatRoutes.js";
import "dotenv/config";

const app = express();

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/flats", flatsRoutes);
app.use("/api", GetflatRoutes);

app.get("/", (req, res) => {
  res.end("Hello world");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
