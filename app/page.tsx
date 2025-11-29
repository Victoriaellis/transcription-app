"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnalysisResultType } from "./types";
import { client } from "@/lib/api-client";
import { AnalysisResultSection } from "./components/analysis-result-section";
import { MAX_CHARS } from "./constants";
import { TranscriptionListSkeleton } from "./components/list-skeleton";
import { ExistingTranscriptSection } from "./components/existing-transcript-section";
import { TranscriptNotFound } from "./components/transcript-not-found";

export default function HomePage() {
  const [text, setText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isTextTooLong = text.length > MAX_CHARS;

  const analyseMutation = useMutation({
    mutationFn: async (text: string): Promise<AnalysisResultType> => {
      const { status, body } = await client.analyse.analyse({
        body: { text },
      });

      if (status !== 200) {
        throw new Error("Failed to analyse transcript");
      }

      return body.analysis;
    },
  });

  const { data: transcriptions, isLoading } = useQuery({
    queryKey: ["transcriptions"],
    queryFn: async () => {
      const res = await client.transcripts.list();
      if (res.status !== 200) throw new Error("Failed to fetch");
      return res.body.transcriptions;
    },
  });

  const {
    data: selectedTranscript,
    isLoading: isLoadingTranscript,
    isError: isTranscriptError,
  } = useQuery({
    queryKey: ["transcription", selectedId],
    queryFn: async () => {
      if (!selectedId) return null;
      const res = await client.transcripts.get({
        params: { id: selectedId },
      });
      if (res.status !== 200) throw new Error("Failed to fetch transcript");
      return res.body;
    },
    enabled: !!selectedId,
  });

  const handleAnalyseTranscriptClick = () => {
    analyseMutation.mutate(text);
  };

  const deselectTranscriptId = () => {
    setSelectedId(null);
  };

  const analysisResult = analyseMutation.data;

  if (selectedId) {
    if (isLoadingTranscript) {
      return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500 text-lg animate-pulse">
            Loading transcript…
          </div>
        </main>
      );
    }

    if (!selectedTranscript || isTranscriptError) {
      return <TranscriptNotFound deselectTranscriptId={deselectTranscriptId} />;
    }

    return (
      <ExistingTranscriptSection
        selectedTranscript={selectedTranscript}
        deselectTranscriptId={deselectTranscriptId}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-10">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Meeting Transcript Analysis
          </h1>
          <p className="text-gray-600 text-lg">
            Paste your meeting notes and get insights instantly.
          </p>
        </header>

        <section className="bg-white p-6 rounded-xl border shadow-sm space-y-5 hover:shadow-md transition">
          <label className="text-sm font-semibold text-gray-700">
            Paste Transcript
          </label>

          {!analysisResult ? (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste meeting notes here…"
                className="w-full h-52 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-none transition resize-none text-gray-700"
              />

              {isTextTooLong && (
                <p className="text-red-600 text-sm font-medium">
                  Text is too long. Reduce to less than{" "}
                  {MAX_CHARS.toLocaleString()} characters.
                </p>
              )}

              <button
                onClick={handleAnalyseTranscriptClick}
                disabled={!text || analyseMutation.isPending || isTextTooLong}
                className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 transition text-lg cursor-pointer"
              >
                {analyseMutation.isPending
                  ? "Analysing…"
                  : "Analyse Transcript"}
              </button>
            </>
          ) : (
            <p className="p-3 bg-gray-100 rounded-lg text-gray-700 whitespace-pre-wrap">
              {text}
            </p>
          )}

          {analyseMutation.isError && (
            <p className="text-red-600 text-sm">
              Something went wrong. Try again.
            </p>
          )}
        </section>

        {analysisResult && (
          <AnalysisResultSection analysisResult={analysisResult} />
        )}

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 w-full">
          <h2 className="text-xl font-bold text-gray-800">
            Your previous transcriptions
          </h2>

          {isLoading ? (
            <TranscriptionListSkeleton />
          ) : (
            <ul className="space-y-4">
              {transcriptions?.map((t) => (
                <li
                  key={t.id}
                  onClick={() => setSelectedId(t.id)}
                  className="p-4 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition"
                >
                  <p className="font-semibold text-gray-800">
                    {new Date(t.createdAt).toLocaleString()}
                  </p>
                  <p className="text-gray-700 line-clamp-2">{t.text}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
