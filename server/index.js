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

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

const app = express();

app.set("trust proxy", 1); // trust first proxy

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === "https://ai-resume-cover-letters-generator.vercel.app" ||
        /^https:\/\/ai-resume-cover-letters-generator-.*\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
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

const SYSTEM_PROMPT = `You are an expert resume writer and ATS specialist.

Strict rules:
- Use ONLY facts stated in the resume or additional info. Never invent employers, job titles, years of experience, technologies, tools, metrics, or percentages.
- If the job requires a skill the resume does not show, mark it as not found in keywords. Never claim it in the summary or cover letter.
- Do not include any number in the summary or cover letter unless it appears in the resume.
- If the candidate has no professional experience, do not imply they do. Emphasize projects, education, and coursework instead.
- Cover letter: first person, 250-350 words, plain paragraphs, no bullet points, no markdown, no placeholders.
- Return only JSON matching the schema.`;

const schema = {
  type: "object",
  properties: {
    candidate_name: { type: "string" },
    keywords: {
      type: "array",
      description:
        "Important skills/requirements extracted from the job description",
      items: {
        type: "object",
        properties: {
          keyword: { type: "string" },
          found_in_resume: { type: "boolean" },
          suggestion: {
            type: "string",
            description:
              "If missing: how to honestly address it (e.g. learn it, rephrase existing experience). Empty if found.",
          },
        },
        required: ["keyword", "found_in_resume", "suggestion"],
        additionalProperties: false,
      },
    },
    summary: { type: "string" },
    cover_letter: { type: "string" },
  },
  required: ["candidate_name", "keywords", "summary", "cover_letter"],
  additionalProperties: false,
};

app.post("/generate", limiter, upload.single("resume"), async (req, res) => {
  try {
    const resumeText = await extractText(req.file);

    const { jobTitle, jobDescription, additionalInfo } = req.body;

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      temperature: 0.3,
      response_format: {
        type: "json_schema",
        json_schema: { name: "resume_analysis", strict: true, schema },
      },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Today's date: ${new Date().toDateString()}

<resume>
${resumeText}
</resume>

<job_title>${jobTitle}</job_title>

<job_description>
${jobDescription}
</job_description>

<additional_info>
${additionalInfo || ""}
</additional_info>`,
        },
      ],
    });

    let data;
    try {
      data = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      console.error("Model returned invalid JSON:", parseError);
      return res.status(502).json({ error: "Model returned invalid output" });
    }

    // Deterministic ATS score
    const total = data.keywords.length;
    const matched = data.keywords.filter((k) => k.found_in_resume).length;
    const atsScore = total ? Math.round((matched / total) * 100) : 0;

    res.json({
      atsScore,
      matchedKeywords: data.keywords
        .filter((k) => k.found_in_resume)
        .map((k) => k.keyword),
      missingKeywords: data.keywords.filter((k) => !k.found_in_resume),
      summary: data.summary,
      coverLetter: data.cover_letter,
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});