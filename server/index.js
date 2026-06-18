import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/generate", async (req, res) => {
  try {
    const {
      jobTitle,
      jobDescription,
      additionalInfo,
    } = req.body;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
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

app.get("/", (req, res) => {
  res.send("AI Resume API is running");
});

app.listen(3001, () => {
  console.log(
    "Server running on http://localhost:3001"
  );
});