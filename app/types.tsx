export type ActionType = {
  description: string;
  owner?: string;
  deadline?: string;
};

export type AnalysisResultType = {
  actionItems: ActionType[];
  decisions: string[];
  sentiment?: string;
};
