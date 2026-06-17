// Declare minimal process.env typing to avoid TS error in this file scope
declare const process: { env: { OPENAI_API_KEY?: string } };

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const body = await req.json();

  const {
    resumeText,
    jobTitle,
    jobDescription,
    additionalInfo,
  } = body;

  const completion =
    await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume writer and career coach.",
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

Additional Information:
${additionalInfo}

Generate:

1. ATS Score
2. Missing Keywords
3. Improved Resume Summary
4. Professional Cover Letter

Return JSON.
`,
        },
      ],
    });

  return Response.json({
    result:
      completion.choices[0].message.content,
  });
}