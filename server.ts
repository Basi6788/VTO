import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { processVTO, generateLogo, generateUIDesign, analyzeMedia } from "./src/services/geminiService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "VTO Server is running" });
  });

  // VTO Endpoint
  app.post("/api/vto", async (req, res) => {
    try {
      const { personImage, productImage, prompt } = req.body;
      if (!personImage || !productImage) {
        return res.status(400).json({ error: "personImage and productImage are required (base64)" });
      }
      const result = await processVTO({ personImage, productImage, prompt });
      res.json({ success: true, image: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Logo Endpoint
  app.post("/api/logo", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "prompt is required" });
      const result = await generateLogo(prompt);
      res.json({ success: true, image: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // UI Design Endpoint
  app.post("/api/ui", async (req, res) => {
    try {
      const { prompt, type = "Website", device = "Desktop" } = req.body;
      if (!prompt) return res.status(400).json({ error: "prompt is required" });
      const result = await generateUIDesign(prompt, type, device);
      res.json({ success: true, image: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Analyze Endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { file, mimeType } = req.body;
      if (!file || !mimeType) return res.status(400).json({ error: "file (base64) and mimeType are required" });
      const result = await analyzeMedia(file, mimeType);
      res.json({ success: true, text: result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VTO Server running on http://localhost:${PORT}`);
  });
}

startServer();
