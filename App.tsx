import React, { useState } from 'react';
import { Bot, Sparkles, AlertCircle } from 'lucide-react';
import { InputArea } from './components/InputArea';
import { ResultsDisplay } from './components/ResultsDisplay';
import { optimizeResume } from './services/geminiService';
import { OptimizationInput, OptimizationResult, ResumeStyle } from './types';

function App() {
  // State for inputs
  const [jobDescription, setJobDescription] = useState('');
  const [userResume, setUserResume] = useState('');
  const [resumeStyle, setResumeStyle] = useState<ResumeStyle>(ResumeStyle.PROFESSIONAL);

  // State for process
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const isFormValid = jobDescription.length > 50 && userResume.length > 50;

  const handleOptimize = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const input: OptimizationInput = {
        jobDescription,
        userResume,
        style: resumeStyle,
      };

      const data = await optimizeResume(input);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while processing your resume.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              ATS Resume <span className="text-blue-600">Optimizer</span>
            </h1>
          </div>
          <div className="text-xs text-slate-500 font-medium hidden sm:block bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)] min-h-[600px]">
          
          {/* Left Panel: Inputs */}
          <div className="lg:col-span-5 flex flex-col space-y-6 h-full">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-slate-800">Input Data</h2>
                <div className="relative">
                  <select
                    value={resumeStyle}
                    onChange={(e) => setResumeStyle(e.target.value as ResumeStyle)}
                    className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    disabled={isLoading}
                  >
                    <option value={ResumeStyle.PROFESSIONAL}>Professional Style</option>
                    <option value={ResumeStyle.MODERN}>Modern Style</option>
                    <option value={ResumeStyle.MINIMAL}>Minimal Style</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <InputArea
                label="Job Description (JD)"
                placeholder="Paste the full job description here..."
                value={jobDescription}
                onChange={setJobDescription}
                heightClass="flex-1 min-h-[150px]"
                disabled={isLoading}
              />

              <InputArea
                label="Original Resume"
                placeholder="Paste your current resume content here..."
                value={userResume}
                onChange={setUserResume}
                heightClass="flex-1 min-h-[150px]"
                disabled={isLoading}
              />

              {error && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleOptimize}
                disabled={!isFormValid || isLoading}
                className={`w-full py-4 px-6 rounded-xl flex items-center justify-center space-x-2 font-bold text-white shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0
                  ${!isFormValid || isLoading 
                    ? 'bg-slate-400 cursor-not-allowed shadow-none' 
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'}`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Optimizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Optimized Resume</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Panel: Results */}
          <div className="lg:col-span-7 h-full min-h-[500px]">
            {result ? (
              <ResultsDisplay result={result} />
            ) : (
              <div className="bg-slate-100 rounded-xl border border-slate-200 border-dashed h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-2">Ready to Optimize</h3>
                <p className="max-w-sm mx-auto text-sm">
                  Paste your resume and the job description to generate an ATS-optimized version tailored to the specific role.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-md">
                   <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center">
                      <span className="text-xs font-bold text-blue-600 uppercase mb-1">Step 1</span>
                      <span className="text-xs text-slate-500">Paste JD</span>
                   </div>
                   <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center">
                      <span className="text-xs font-bold text-blue-600 uppercase mb-1">Step 2</span>
                      <span className="text-xs text-slate-500">Paste Resume</span>
                   </div>
                   <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center">
                      <span className="text-xs font-bold text-blue-600 uppercase mb-1">Step 3</span>
                      <span className="text-xs text-slate-500">Optimize</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
