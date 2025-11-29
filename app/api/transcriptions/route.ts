import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const transcriptions = await prisma.transcript.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({
    transcriptions,
  });
}
