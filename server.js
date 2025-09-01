import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import axios from "axios";

const DEEPSEEK_KEY = process.env.DEEPSEEK_KEY;

if (!DEEPSEEK_KEY) {
  console.error("❌ DEEPSEEK_KEY missing in .env");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors());

app.post("/ask", async (req, res) => {
  const userQuestion = req.body.question;
  console.log("📩 Incoming question:", userQuestion);

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: "user", content: userQuestion }]
      },
      {
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_KEY}`,
          "Content-Type": "application/json"
        },
        timeout: 20000 // 20s timeout
      }
    );

    const answer =
      response.data?.choices?.[0]?.message?.content ||
      response.data?.choices?.[0]?.text ||
      "No answer received";

    res.json({ answer });
  } catch (error) {
    console.error("❌ DeepSeek API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get response from DeepSeek" });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
