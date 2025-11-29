import { AnalysisResultType } from "../types";
import { Card } from "./card";
interface IAnalysisResultSectionProps {
  analysisResult: AnalysisResultType;
}

export const AnalysisResultSection = ({
  analysisResult,
}: IAnalysisResultSectionProps) => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Analysis Results</h2>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Meeting actions</h3>
        <ul className="space-y-2 text-gray-700">
          {analysisResult.actionItems.map((action) => (
            <Card key={action.description} action={action} />
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-800 mb-3">Meeting decisions</h3>
        <ul className="space-y-2 text-gray-700">
          {analysisResult.decisions.map((decision) => (
            <li key={decision}>{decision}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};
