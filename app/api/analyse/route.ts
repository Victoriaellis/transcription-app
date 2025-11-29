import { MAX_CHARS } from "@/app/constants";
import { analyseTranscript } from "@/lib/analysis";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

function cleanJsonString(str: string) {
  return str
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) return errorResponse("Text is required");
    if (text.length < 10)
      return errorResponse("Text must be at least 10 characters");
    if (text.length > MAX_CHARS) {
      return errorResponse(
        `Text exceeds maximum length of ${MAX_CHARS} characters`
      );
    }

    const transcript = await prisma.transcript.create({
      data: { text },
    });

    const llmResponse = await analyseTranscript(text);

    let parsed;
    try {
      parsed = JSON.parse(cleanJsonString(llmResponse));
    } catch {
      return errorResponse("LLM returned invalid JSON", 500);
    }

    const { actionItems = [], decisions = [], sentiment = null } = parsed;

    await prisma.analysis.create({
      data: {
        transcriptId: transcript.id,
        actionItems,
        decisions,
        sentiment,
      },
    });

    return NextResponse.json({
      transcriptId: transcript.id,
      analysis: { actionItems, decisions, sentiment },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return errorResponse("Failed to analyse transcript", 500);
  }
}
