import { AnalysisResultType } from "../types";
import { Card } from "./card";

interface IAnalysisResultSectionProps {
  analysisResult: AnalysisResultType;
}

export const AnalysisResultSection = ({
  analysisResult,
}: IAnalysisResultSectionProps) => {
  const sentimentColor = {
    positive: "text-green-600 bg-green-50 border-green-200",
    negative: "text-red-600 bg-red-50 border-red-200",
    neutral: "text-yellow-600 bg-yellow-50 border-yellow-200",
  }[analysisResult.sentiment?.toLowerCase() || "neutral"];

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
          Meeting Actions
        </h3>
        {analysisResult.actionItems.length > 0 ? (
          <ul className="space-y-3">
            {analysisResult.actionItems.map((action) => (
              <Card key={action.description} action={action} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No action items found.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
        <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center gap-2">
          Meeting Decisions
        </h3>

        {analysisResult.decisions.length > 0 ? (
          <ul className="space-y-2 text-gray-700 list-disc list-inside">
            {analysisResult.decisions.map((decision) => (
              <li key={decision}>{decision}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No decisions recorded.</p>
        )}
      </div>

      <div
        className={`p-6 rounded-xl shadow-sm border transition ${sentimentColor}`}
      >
        <h3 className="font-semibold text-lg mb-2">
          Overall Meeting Sentiment
        </h3>
        <p className="capitalize font-medium text-lg">
          {analysisResult.sentiment || "Neutral"}
        </p>
      </div>
    </section>
  );
};
