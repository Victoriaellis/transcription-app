"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnalysisResultType } from "./types";
import { client } from "@/lib/api-client";
import { AnalysisResultSection } from "./components/analysis-result-section";
import { MAX_CHARS } from "./constants";

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

  const analysisResult = analyseMutation.data;

  if (selectedId) {
    if (isLoadingTranscript) {
      return (
        <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <p className="text-gray-600">Loading transcript...</p>
        </main>
      );
    }

    if (!selectedTranscript || isTranscriptError) {
      return (
        <main className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-600">Transcript not found</p>
            <button
              onClick={() => setSelectedId(null)}
              className="text-blue-600 hover:underline"
            >
              ← Back to home
            </button>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-8">
          <button
            onClick={() => setSelectedId(null)}
            className="text-blue-600 hover:underline flex items-center gap-2 cursor-pointer"
          >
            ← Back to all transcripts
          </button>

          <header className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">
              Transcript Details
            </h1>
            <p className="text-gray-600">
              {new Date(selectedTranscript.createdAt).toLocaleString()}
            </p>
          </header>

          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-800">Full Transcript</h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {selectedTranscript.text}
            </p>
          </section>

          <AnalysisResultSection analysisResult={selectedTranscript.analysis} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Meeting Transcript Analysis
          </h1>
          <p className="text-gray-600">
            Input your meeting transcript below and get AI insights.
          </p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Meeting Transcript
          </label>

          {analysisResult ? (
            <p className="p-3 bg-gray-100 rounded-lg text-gray-700">{text}</p>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste meeting notes or transcript here in plain text..."
                className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {isTextTooLong && (
                <p className="text-red-500 text-sm">
                  Text is too long. Please reduce to fewer than{" "}
                  {MAX_CHARS.toLocaleString()} characters.
                </p>
              )}

              <button
                onClick={handleAnalyseTranscriptClick}
                disabled={!text || analyseMutation.isPending || isTextTooLong}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg 
                    hover:bg-blue-700 disabled:bg-blue-300 transition"
              >
                {analyseMutation.isPending
                  ? "Analysing..."
                  : "Analyse Transcript"}
              </button>
            </>
          )}

          {analyseMutation.isError && (
            <p className="text-red-500 text-sm">
              Something went wrong. Try again.
            </p>
          )}
        </section>

        {analysisResult && (
          <AnalysisResultSection analysisResult={analysisResult} />
        )}

        {!isLoading && (
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 w-full max-w-3xl">
            <h2 className="text-xl font-bold text-gray-800">
              Your previous transcriptions
            </h2>
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
          </section>
        )}
      </div>
    </main>
  );
}
