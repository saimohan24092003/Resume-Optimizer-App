import { GoogleGenAI, Schema, Type } from "@google/genai";
import { OptimizationInput, OptimizationResult } from "../types";

// Helper to get the API key
const getApiKey = (): string => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API configuration error: Missing API Key.");
  }
  return key;
};

// Define the response schema to ensure Gemini returns valid JSON matching our types
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    optimizedResume: {
      type: Type.STRING,
      description: "The full, plain text optimized resume content, formatted with bullet points.",
    },
    latexBlocks: {
      type: Type.OBJECT,
      properties: {
        header: { type: Type.STRING, description: "LaTeX code for the header section." },
        summary: { type: Type.STRING, description: "LaTeX code for the summary section." },
        skills: { type: Type.STRING, description: "LaTeX code for the skills section." },
        experience: { type: Type.STRING, description: "LaTeX code for the experience section." },
        education: { type: Type.STRING, description: "LaTeX code for the education section." },
      },
      required: ["header", "summary", "skills", "experience", "education"],
    },
    atsReport: {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Estimated ATS score from 0 to 100." },
        keywordMatch: { type: Type.STRING, description: "Percentage and description of keyword matching." },
        topImprovements: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of top improvements made to the resume.",
        },
      },
      required: ["score", "keywordMatch", "topImprovements"],
    },
  },
  required: ["optimizedResume", "latexBlocks", "atsReport"],
};

const SYSTEM_PROMPT = `
You are an ATS Resume Optimization Engine designed for a job-application platform.
You specialize in optimizing resumes for:
SAP Enable Now
Instructional Designer
Subject Matter Expert (SME)
SAP SuccessFactors
LMS / LXP platforms
Global roles

Your primary goal is to produce a high ATS score resume.

OBJECTIVES:
- Maximize ATS keyword match
- Align resume content precisely with the JD
- Maintain factual accuracy
- Do NOT fabricate experience or skills
- Output must be ATS-readable

TASKS:
1. JD ANALYSIS: Extract title, responsibilities, skills, tools, and keywords.
2. RESUME ALIGNMENT: Rewrite resume to match JD terminology. Reorder skills. Rewrite bullets (Action Verb + Responsibility + Impact). Emphasize SAP/LMS/ID/SME relevance.
3. OPTIMIZATION: Use standard sections (Summary, Skills, Experience, Education). No tables/icons.

CONSTRAINTS:
- Do NOT invent experience.
- Do NOT add skills not present in original resume.
- Do NOT change dates or employers.
- Optimize wording only.
`;

export const optimizeResume = async (input: OptimizationInput): Promise<OptimizationResult> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Please perform the ATS Resume Optimization task.

    JOB DESCRIPTION:
    ${input.jobDescription}

    USER RESUME:
    ${input.userResume}

    SELECTED TEMPLATE STYLE:
    ${input.style}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2, // Low temperature for factual consistency
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No content generated from Gemini.");
    }

    const result = JSON.parse(jsonText) as OptimizationResult;
    return result;

  } catch (error) {
    console.error("Error optimizing resume:", error);
    throw error;
  }
};
