import React, { useState } from 'react';
import { OptimizationResult } from '../types';
import { Check, Copy, FileText, Code, BarChart, Clipboard } from 'lucide-react';

interface ResultsDisplayProps {
  result: OptimizationResult;
}

type Tab = 'resume' | 'latex' | 'report';

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<Tab>('resume');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200 bg-slate-50">
        <button
          onClick={() => setActiveTab('resume')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'resume'
              ? 'text-blue-600 bg-white border-t-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Optimized Resume</span>
        </button>
        <button
          onClick={() => setActiveTab('latex')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'latex'
              ? 'text-blue-600 bg-white border-t-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>LaTeX Blocks</span>
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-4 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'report'
              ? 'text-blue-600 bg-white border-t-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          <BarChart className="w-4 h-4" />
          <span>ATS Report</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
        
        {/* Optimized Resume Tab */}
        {activeTab === 'resume' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-slate-800">Plain Text Output</h3>
              <button
                onClick={() => handleCopy(result.optimizedResume, 'full-resume')}
                className="flex items-center space-x-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-full"
              >
                {copiedSection === 'full-resume' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSection === 'full-resume' ? 'Copied' : 'Copy All'}</span>
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
              {result.optimizedResume}
            </div>
          </div>
        )}

        {/* LaTeX Blocks Tab */}
        {activeTab === 'latex' && (
          <div className="space-y-6">
            <div className="flex items-center space-x-2 text-slate-600 mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <Clipboard className="w-5 h-5 text-yellow-600" />
              <p className="text-xs">Copy these blocks directly into your Overleaf template main file.</p>
            </div>

            {Object.entries(result.latexBlocks).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">{key}</span>
                  <button
                    onClick={() => handleCopy(value as string, `latex-${key}`)}
                    className="text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    {copiedSection === `latex-${key}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto font-mono border border-slate-700">
                  <code>{value as string}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* ATS Report Tab */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm text-slate-500 uppercase font-semibold tracking-wider mb-1">Estimated ATS Score</h4>
                <p className="text-slate-600 text-sm">Based on keyword matching and formatting.</p>
              </div>
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke={result.atsReport.score > 75 ? "#22c55e" : result.atsReport.score > 50 ? "#eab308" : "#ef4444"}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={226}
                    strokeDashoffset={226 - (226 * result.atsReport.score) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="absolute text-xl font-bold text-slate-800">{result.atsReport.score}</span>
              </div>
            </div>

            {/* Keyword Match */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm text-slate-500 uppercase font-semibold tracking-wider mb-3">Keyword Analysis</h4>
              <p className="text-slate-800 font-medium">{result.atsReport.keywordMatch}</p>
            </div>

            {/* Improvements */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm text-slate-500 uppercase font-semibold tracking-wider mb-4">Top Improvements Made</h4>
              <ul className="space-y-3">
                {result.atsReport.topImprovements.map((imp, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-700 text-sm leading-relaxed">{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
