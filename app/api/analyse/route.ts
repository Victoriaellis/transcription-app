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

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "Text must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (text.length > MAX_CHARS) {
      return NextResponse.json(
        { error: `Text exceeds maximum length of ${MAX_CHARS} characters` },
        { status: 400 }
      );
    }

    const transcript = await prisma.transcript.create({
      data: { text },
    });

    const llmResponse = await analyseTranscript(text);
    const cleaned = cleanJsonString(llmResponse);
    const parsed = JSON.parse(cleaned);

    const actionItems = Array.isArray(parsed.actionItems)
      ? parsed.actionItems
      : [];
    const decisions = Array.isArray(parsed.decisions) ? parsed.decisions : [];

    await prisma.analysis.create({
      data: {
        transcriptId: transcript.id,
        actionItems,
        decisions,
      },
    });

    return NextResponse.json({
      transcriptId: transcript.id,
      analysis: {
        actionItems,
        decisions,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyse transcript" },
      { status: 500 }
    );
  }
}
