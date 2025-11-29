interface TranscriptNotFoundProps {
  deselectTranscriptId: () => void;
}

export const TranscriptNotFound = ({
  deselectTranscriptId,
}: TranscriptNotFoundProps) => {
  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-red-600 font-semibold text-lg">
          Transcript not found
        </p>
        <button
          onClick={deselectTranscriptId}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          ← Back to all transcripts
        </button>
      </div>
    </section>
  );
};
