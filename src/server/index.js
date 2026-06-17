import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      additionalInfo,
    } = req.body;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an expert resume writer.",
          },
          {
            role: "user",
            content: `
Job Title:
${jobTitle}

Job Description:
${jobDescription}

Additional Info:
${additionalInfo}

Generate:
1. Resume Summary
2. Cover Letter
`,
          },
        ],
      });

    res.json({
      result:
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to generate",
    });
  }
});

app.listen(3001, () => {
  console.log(
    "Server running on http://localhost:3001"
  );
});