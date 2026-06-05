import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Initialize environment variables
dotenv.config();

// Lazy initialization of GoogleGenAI SDK
let aiInstance: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Assistant Chat Route
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      const ai = getAi();
      
      // We can use the elegant chats model or single-shot generation.
      // Let's create a Chat session or use generateContent with conversational system instruction.
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: "You are a professional Tatkal train ticket expert and helper. Provide excellent guidance on Indian Railways." }]
          },
          ...(history || []).map((msg: any) => ({
            role: msg.role === 'model' ? 'model' as const : 'user' as const,
            parts: [{ text: msg.text }]
          })),
          {
            role: "user" as const,
            parts: [{ text: message }]
          }
        ],
        config: {
          systemInstruction: `You are 'Tatkal Expert', an elite, highly knowledgeable Indian Railways booking assistant.
Your expertise covers:
1. Tatkal booking schedules (AC classes start at 10:00 AM, Non-AC Sleeper classes start at 11:00 AM of the day prior to travel date).
2. Passenger master list creation & browser extension autofill configurations (essential for extreme booking speed).
3. Refund policies (No refunds on confirmed Tatkal tickets, exceptions for delayed trains over 3 hours, line diversions, or non-attachment of coaches).
4. Waitlist confirmation chances based on historical ticket clearance (e.g. PQWL, RLWL, GNWL).
5. Captcha delays, payment gateway speeds (recommend UPI/Net Banking for express processing), and security locks.

Provide helpful advice including markdown lists or tables if needed. Ensure answers are realistic, detailed, encouraging, and accurate to official IRCTC / Indian Railway policies. Keep answers concise, direct, and completely free of filler.`,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I apologize, I could not process your query.";
      res.json({ reply });

    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ 
        error: error?.message || "Failed to contact Gemini AI",
        hints: "Ensure GEMINI_API_KEY is configured in your project's secrets panel."
      });
    }
  });

  // Live Simulated Alerts Engine Data Endpoint
  app.get("/api/system-logs", (req, res) => {
    res.json({
      activeBackgroundTrackers: 2,
      cpuLoad: "12%",
      lastCheckedTime: new Date().toISOString(),
      networkInbound: "2.4 Mbps",
      secureVaultEncrypted: true
    });
  });

  // Vite development or production routing
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tatkal Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
});
