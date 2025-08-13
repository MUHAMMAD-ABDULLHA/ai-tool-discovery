import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import toolRoutes from "./routes/toolRoutes.js";
import "./db/db.js"; // DB connection

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/tools", toolRoutes);

// Port config
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
