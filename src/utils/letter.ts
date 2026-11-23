export type Contact = { name: string; email: string; phone: string };

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
  return `Dear Hiring Manager,\n\n${body.trim()}\n\n${signoff}`;
}
