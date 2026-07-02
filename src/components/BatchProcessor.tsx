import React, { useState } from 'react';
import { Play, Loader2, AlertCircle, CheckCircle2, FileText, Smile, Frown, Meh } from 'lucide-react';
import { Sentiment } from '../types';

interface ProcessedResult {
  text: string;
  sentiment: Sentiment;
  confidence: number;
}

export default function BatchProcessor() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedResult[] | null>(null);

  const handleProcess = () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    setResults(null);

    // Simulate batch processing API call
    setTimeout(() => {
      const lines = input.split('\n').filter(line => line.trim().length > 0);
      
      const mockResults = lines.map(line => {
        const text = line.toLowerCase();
        let sentiment: Sentiment = 'neutral';
        
        // Simple mock logic for demonstration
        if (text.includes('good') || text.includes('great') || text.includes('love') || text.includes('best') || text.includes('fantastic')) {
          sentiment = 'positive';
        } else if (text.includes('bad') || text.includes('terrible') || text.includes('hate') || text.includes('worst') || text.includes('crash') || text.includes('disappoint')) {
          sentiment = 'negative';
        }

        return {
          text: line,
          sentiment,
          confidence: Math.floor(Math.random() * 20) + 80, // Random 80-99%
        };
      });

      setResults(mockResults);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Batch Processing</h1>
        <p className="text-slate-500 mt-1">Paste multiple comments (one per line) for instant sentiment analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-slate-200 flex items-center gap-2 text-slate-900 font-semibold text-sm">
              <FileText size={16} />
              Input Data
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter comments here...&#10;One comment per line.&#10;&#10;Example:&#10;I absolutely love this new feature!&#10;The application crashed again today.&#10;It's okay, nothing special."
              className="flex-1 w-full p-4 resize-none bg-transparent focus:outline-none focus:border-indigo-500 text-slate-900 placeholder-slate-400 leading-relaxed transition-all"
            />
          </div>
          <button
            onClick={handleProcess}
            disabled={isProcessing || !input.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 py-3 px-4 rounded-xl font-bold text-xs transition-colors uppercase tracking-wider"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing Batch...
              </>
            ) : (
              <>
                <Play size={16} />
                Run Processing Engine
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 flex flex-col h-[500px] overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <CheckCircle2 size={16} className="text-emerald-500" />
                Analysis Results
              </div>
              {results && (
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                  {results.length} ITEMS
                </span>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {!results && !isProcessing && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <AlertCircle size={32} />
                  <p className="text-sm text-center max-w-[200px]">Results will appear here after processing your data.</p>
                </div>
              )}

              {isProcessing && (
                <div className="h-full flex flex-col items-center justify-center text-indigo-500 space-y-4">
                  <Loader2 size={32} className="animate-spin" />
                  <p className="text-sm font-bold animate-pulse uppercase tracking-widest text-[10px]">Running ML models...</p>
                </div>
              )}

              {results && (
                <div className="space-y-2">
                  {results.map((result, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-transparent hover:border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
                      <p className="text-sm text-slate-700 mb-3 leading-relaxed">{result.text}</p>
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          result.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          result.sentiment === 'negative' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {result.sentiment === 'positive' && <Smile size={12} />}
                          {result.sentiment === 'negative' && <Frown size={12} />}
                          {result.sentiment === 'neutral' && <Meh size={12} />}
                          {result.sentiment}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {result.confidence / 100}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
