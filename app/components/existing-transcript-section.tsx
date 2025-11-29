import { TranscriptionType } from "../types";
import { AnalysisResultSection } from "./analysis-result-section";

interface ExistingTranscriptSectionProps {
  selectedTranscript: TranscriptionType;
  deselectTranscriptId: () => void;
}

export const ExistingTranscriptSection = ({
  selectedTranscript,
  deselectTranscriptId,
}: ExistingTranscriptSectionProps) => {
  return (
    <section className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="w-full max-w-4xl space-y-10">
        <button
          onClick={deselectTranscriptId}
          className="text-blue-600 hover:underline flex items-center gap-2 cursor-pointer"
        >
          ← Back to all transcripts
        </button>

        <header className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Transcript Details
          </h1>
          <p className="text-gray-500">
            {new Date(selectedTranscript.createdAt).toLocaleString()}
          </p>
        </header>

        <section className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Full Transcript
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {selectedTranscript.text}
          </p>
        </section>

        <AnalysisResultSection analysisResult={selectedTranscript.analysis} />
      </div>
    </section>
  );
};
