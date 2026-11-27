export type Contact = { name: string; email: string; phone: string };

// Characters Helvetica in jsPDF can actually draw
const SAFE = /^[\n\x20-\x7E\xA1-\xFF\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026]$/;

// Swaps characters LLMs like to use (and PDF fonts can't draw) for plain equivalents
export function normalizeText(text: string) {
  return Array.from(
    text
      .replace(/[\u2010\u2011\u2012\u2212]/g, "-") // fancy hyphens and minus
      .replace(/[\u00A0\u2007\u2009\u200A\u202F\t]/g, " ") // special spaces
      .replace(/[\u200B-\u200D\u2060\uFEFF\r]/g, "") // zero-width chars
  )
    .map((ch) => {
      if (SAFE.test(ch)) return ch;
      // "ő" -> "o"; anything still unsupported is dropped
      const base = ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return SAFE.test(base) ? base : "";
    })
    .join("");
}

export function formatContactLine(email: string, phone: string) {
  return [email, phone]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" | ");
}

// Removes a greeting or sign-off if the model adds one anyway
export function stripFraming(body: string) {
  return body
    .replace(/^\s*dear\b[^\n]*\n+/i, "")
    .replace(
      /\n+\s*(sincerely|best regards|kind regards|regards|respectfully)\s*[,.]?\s*(\n[\s\S]*)?$/i,
      ""
    )
    .trim();
}

export function buildLetter(body: string, { name, email, phone }: Contact) {
  const signoff = ["Sincerely,", name.trim(), formatContactLine(email, phone)]
    .filter(Boolean)
    .join("\n");
  return normalizeText(`Dear Hiring Manager,\n\n${body.trim()}\n\n${signoff}`);
}