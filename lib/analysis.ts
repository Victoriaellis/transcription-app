import { model } from "./llm";

export async function analyseTranscript(text: string) {
  const prompt = `
Extract the following from the meeting transcript:

1. Action items (with description, owner, deadline)
2. Key decisions

Return ONLY valid JSON.
NO backticks.
NO code blocks.
NO explanations.
Match this exact JSON format:

{
  "actionItems": [
    { "description": "...", "owner": "...", "deadline": "..." }
  ],
  "decisions": ["...", "..."],
}

Transcript:
${text}
  `;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  return response;
}
