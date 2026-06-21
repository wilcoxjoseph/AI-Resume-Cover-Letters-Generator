import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import multer from "multer";
import pdf from "pdf-parse";
import mammoth from "mammoth";

dotenv.config();

const upload = multer({
  storage: multer.memoryStorage(),
});

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const resumeText = await extractText(
  req.file
);

async function extractText(file) {
  if (file.mimetype == "application/pdf") {
    const data = await pdf(file.buffer);
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



app.post("/generate", upload.single("resume"), async (req, res) => {
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

const fromData = FormData();

fromData.append(
  "resume",
  files[0]
);

fromData.append(
  "jobTitle",
  jobTitle
);

fromData.append(
  "jobDescription",
  jobDescription
);

fromData.append(
  "additionalInfo",
  additionalInfo
);

const response = await fetch(
  "http://localhost:3001/generate",
  {
    method: "POST",
    body: fromData,
  }
);

app.get("/", (req, res) => {
  res.send("AI Resume API is running");
});

app.listen(3001, () => {
  console.log(
    "Server running on http://localhost:3001"
  );
});