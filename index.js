import express from "express";
import cors from "cors";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url"; // Import this to define __dirname in ESM
import authRoutes from "./routes/authRoutes.js";
import flatsRoutes from "./routes/PostflatsRoutes.js";
import GetflatRoutes from "./routes/GetflatRoutes.js";
import passportGoogle from "./config/passportGoogle.js";
import "dotenv/config";

const app = express();

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(cookieParser()); // Use cookie parser middleware

app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers)
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true if using HTTPS`
      httpOnly: true, // Helps prevent XSS attacks
      sameSite: "lax", // Helps prevent CSRF attacks
    },
  })
);

// Initialize passpot for google
app.use(passportGoogle.initialize());
app.use(passportGoogle.session());

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
