import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");
import mammoth from "mammoth";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
});

dotenv.config();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const app = express();

app.set("trust proxy", 1); // trust first proxy

app.use(cors({
  origin: "https://ai-resume-cover-letters-generator.vercel.app",
}));
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function extractText(file) {
  if (!file) {
    throw new Error("No resume file uploaded");
  }

  if (file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    const data = await parser.getText();
    await parser.destroy();
    return data.text;
  }

  if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value;
  }
  
  throw new Error("Unsupported file type");
}



app.post("/generate", limiter, upload.single("resume"), async (req, res) => {
  try {
const resumeText = await extractText(req.file);

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
              "You are an expert resume writer and ATS specialist.",
          },
          {
            role: "user",
            content: `
Resume:
${resumeText}

Job Title:
${jobTitle}

Job Description:
${jobDescription}

Additional Info:
${additionalInfo}

Generate:
1. ATS Score
2. Missing Keywords
3. Improve Resume Summary
4. Professional Cover Letter
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

// Removed stray client-side FormData/fetch block that caused runtime errors.

app.get("/", (req, res) => {
  res.send("AI Resume API is running");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});