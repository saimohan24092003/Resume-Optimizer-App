export enum ResumeStyle {
  PROFESSIONAL = 'Professional',
  MODERN = 'Modern',
  MINIMAL = 'Minimal',
}

export interface OptimizationInput {
  jobDescription: string;
  userResume: string;
  style: ResumeStyle;
}

export interface LatexBlocks {
  header: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
}

export interface AtsReport {
  score: number;
  keywordMatch: string;
  topImprovements: string[];
}

export interface OptimizationResult {
  optimizedResume: string;
  latexBlocks: LatexBlocks;
  atsReport: AtsReport;
}

export interface LoadingState {
  isLoading: boolean;
  message: string;
}
