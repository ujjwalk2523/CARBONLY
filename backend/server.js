// backend/server.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// 🔹 Middleware
app.use(cors());
app.use(express.json());

// 🔹 MongoDB Connection
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/carbonly";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connection is open");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});

// 🔹 Schema & Model
const projectSchema = new mongoose.Schema({
  user: String,             // Ethereum account or username
  name: String,
  description: String,
  address: String,
  startDate: String,
  boundary: String,
  createdAt: { type: Date, default: Date.now },
});

// Virtual field for dynamic status
projectSchema.virtual("status").get(function () {
  const hoursSince = (Date.now() - this.createdAt.getTime()) / 1000 / 3600;
  return hoursSince >= 72 ? "Approved" : "Pending";
});

projectSchema.set("toJSON", { virtuals: true });
const Project = mongoose.model("Project", projectSchema);

// 🔹 API Routes

// Test route
app.get("/", (req, res) => {
  res.send("🌱 Carbonly Backend is running");
});

// Get all projects for a user
app.get("/projects/:user", async (req, res) => {
  try {
    const projects = await Project.find({ user: req.params.user }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// Create new project
app.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json({ message: "Project created", project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
