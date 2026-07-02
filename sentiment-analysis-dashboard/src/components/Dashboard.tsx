import React, { useState, useMemo, useRef } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from 'recharts';
import { Smile, Frown, Meh, Search, Filter, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X, Database, FileText, Loader2 } from 'lucide-react';
import { CommentData, Sentiment } from '../types';

// Mock data representing existing analyzed dataset
const MOCK_DATA: CommentData[] = [
  { id: '1', text: 'This new update is absolutely fantastic! I love the new features.', sentiment: 'positive', date: '2023-10-25', source: 'Twitter' },
  { id: '2', text: 'The app keeps crashing after I log in. Very frustrating.', sentiment: 'negative', date: '2023-10-26', source: 'App Store' },
  { id: '3', text: 'It works okay, nothing too special but it gets the job done.', sentiment: 'neutral', date: '2023-10-26', source: 'Reddit' },
  { id: '4', text: 'Customer service was incredibly helpful and resolved my issue fast.', sentiment: 'positive', date: '2023-10-27', source: 'Support Ticket' },
  { id: '5', text: 'I am so disappointed with the recent changes. Unusable.', sentiment: 'negative', date: '2023-10-27', source: 'Twitter' },
  { id: '6', text: 'Just downloaded it. We will see how it goes.', sentiment: 'neutral', date: '2023-10-28', source: 'App Store' },
  { id: '7', text: 'Best purchase I have made this year. Highly recommend!', sentiment: 'positive', date: '2023-10-28', source: 'Trustpilot' },
  { id: '8', text: 'Too expensive for what it offers. Not worth the money.', sentiment: 'negative', date: '2023-10-29', source: 'Twitter' },
  { id: '9', text: 'Standard service. Meets expectations.', sentiment: 'neutral', date: '2023-10-29', source: 'Reddit' },
  { id: '10', text: 'I love the UI, it is so clean and easy to navigate.', sentiment: 'positive', date: '2023-10-30', source: 'Twitter' },
];

const COLORS = {
  positive: '#10b981', // emerald-500
  negative: '#f43f5e', // rose-500
  neutral: '#a1a1aa',  // zinc-400
};

export default function Dashboard() {
  const [activeFilters, setActiveFilters] = useState<Sentiment[]>(['positive', 'negative', 'neutral']);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleFilter = (sentiment: Sentiment) => {
    setActiveFilters(prev => 
      prev.includes(sentiment) 
        ? prev.filter(s => s !== sentiment)
        : [...prev, sentiment]
    );
  };
  
  // Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [datasetActive, setDatasetActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }
    
    setError(null);
    setUploadedFile(file);
    
    // Simulate file upload and processing
    let progress = 0;
    setUploadProgress(0);
    setIsAnalyzing(false);
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsAnalyzing(true);
        setTimeout(() => {
          setIsAnalyzing(false);
          setDatasetActive(true);
        }, 1500);
      }
    }, 100);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearDataset = () => {
    setDatasetActive(false);
    setIsAnalyzing(false);
    setUploadedFile(null);
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const stats = useMemo(() => {
    const total = MOCK_DATA.length;
    const positive = MOCK_DATA.filter(d => d.sentiment === 'positive').length;
    const negative = MOCK_DATA.filter(d => d.sentiment === 'negative').length;
    const neutral = MOCK_DATA.filter(d => d.sentiment === 'neutral').length;
    
    const positivePct = total > 0 ? Math.round((positive / total) * 100) : 0;
    const negativePct = total > 0 ? Math.round((negative / total) * 100) : 0;
    const neutralPct = total > 0 ? Math.round((neutral / total) * 100) : 0;
    
    const avgScoreRaw = total > 0 ? (positive - negative) / total : 0;
    const avgScore = total > 0 ? (avgScoreRaw * 100).toFixed(1) : "0";

    return { total, positive, negative, neutral, positivePct, negativePct, neutralPct, avgScore };
  }, []);

  const chartData = [
    { name: 'Positive', value: stats.positive, color: COLORS.positive },
    { name: 'Neutral', value: stats.neutral, color: COLORS.neutral },
    { name: 'Negative', value: stats.negative, color: COLORS.negative },
  ];

  const sourceData = useMemo(() => {
    const sources = MOCK_DATA.reduce((acc, curr) => {
      acc[curr.source] = (acc[curr.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(sources).map(([name, count]) => ({ name, count }));
  }, []);

  const trendData = useMemo(() => {
    const dates = Array.from(new Set(MOCK_DATA.map(d => d.date))).sort();
    return dates.map(date => {
      const dayData = MOCK_DATA.filter(d => d.date === date);
      return {
        date,
        positive: dayData.filter(d => d.sentiment === 'positive').length,
        negative: dayData.filter(d => d.sentiment === 'negative').length,
        neutral: dayData.filter(d => d.sentiment === 'neutral').length,
      };
    });
  }, []);

  const filteredComments = useMemo(() => {
    return MOCK_DATA.filter(comment => {
      const matchesFilter = activeFilters.includes(comment.sentiment);
      const matchesSearch = comment.text.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilters, searchQuery]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 mt-1">Monitor the sentiment distribution of your dataset.</p>
        </div>
        {datasetActive && (
          <button 
            onClick={clearDataset}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg transition-colors text-sm font-medium"
          >
            <Database size={16} />
            Switch Dataset
          </button>
        )}
      </div>

      {!datasetActive ? (
        isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-white rounded-2xl border border-slate-200">
            <Loader2 size={40} className="animate-spin text-indigo-600" />
            <div className="text-center space-y-1">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Analyzing Dataset</h2>
              <p className="text-slate-500 text-sm">Processing sentiment and extracting insights...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">Upload New Dataset</h2>
              
              {/* Drag and Drop Zone */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-50/50' 
                    : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Upload size={32} />
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">Click or drag and drop to upload</h3>
                <p className="text-slate-500 text-sm">CSV files containing social media comments (Max 50MB)</p>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileInput} 
                  accept=".csv" 
                  className="hidden" 
                />
              </div>

              {error && (
                <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-600 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              {/* Upload Progress / Success */}
              {uploadedFile && !error && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 border border-indigo-100">
                        <FileSpreadsheet size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{uploadedFile.name}</p>
                        <p className="text-xs text-slate-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    {uploadProgress === 100 ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded border border-emerald-200 uppercase">Done</span>
                    ) : (
                      <span className="text-xs font-mono text-indigo-600">{uploadProgress}%</span>
                    )}
                  </div>
                  
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Existing Datasets Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Database size={18} className="text-slate-400" />
                <h2 className="text-sm font-semibold text-slate-900">Available Datasets</h2>
              </div>
              
              <div className="space-y-3">
                <div 
                  onClick={() => {
                    setUploadedFile(new File([], 'twitter_july_extract.csv'));
                    setDatasetActive(true);
                  }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-slate-500 group-hover:text-slate-900 transition-colors">twitter_july_extract.csv</h3>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><FileText size={12} /> 10 rows (Demo)</span>
                    <span>1.2 MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )
      ) : (
        <>
          {/* Summary Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8">
            <div className="p-4 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-sm font-semibold text-slate-900">Key Metrics Summary</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Metric</th>
                    <th className="px-6 py-4">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">Total Comments Analyzed</td>
                    <td className="px-6 py-4 text-slate-900 font-bold">{stats.total}</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">Average Sentiment Score</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                        Number(stats.avgScore) > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                        Number(stats.avgScore) < 0 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {Number(stats.avgScore) > 0 ? '+' : ''}{stats.avgScore}
                      </span>
                      <span className="text-slate-400 text-xs">(-100 to +100)</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">Category Breakdown</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="text-emerald-600 flex items-center gap-1.5"><Smile size={14} /> {stats.positivePct}% Positive</span>
                        <span className="text-slate-500 flex items-center gap-1.5"><Meh size={14} /> {stats.neutralPct}% Neutral</span>
                        <span className="text-rose-600 flex items-center gap-1.5"><Frown size={14} /> {stats.negativePct}% Negative</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-900 mb-6">Sentiment Distribution</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: 'white', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-900 mb-6">Volume by Source</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: 'white', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trend Line Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 flex flex-col">
        <h2 className="text-sm font-semibold text-slate-900 mb-6">Sentiment Trend Over Time</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a' }}
              />
              <Legend wrapperStyle={{ color: '#64748b' }} />
              <Line type="monotone" dataKey="positive" stroke={COLORS.positive} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="neutral" stroke={COLORS.neutral} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="negative" stroke={COLORS.negative} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dataset Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-slate-900">Dataset Explorer</h2>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search comments..." 
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-full sm:w-64 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {(['positive', 'neutral', 'negative'] as const).map((opt) => {
                const isActive = activeFilters.includes(opt);
                return (
                  <button
                    key={opt}
                    onClick={() => toggleFilter(opt)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg uppercase transition-all border ${
                      isActive 
                        ? opt === 'positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm' :
                          opt === 'negative' ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm' :
                          'bg-slate-100 text-slate-700 border-slate-300 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      opt === 'positive' ? 'bg-emerald-500' :
                      opt === 'negative' ? 'bg-rose-500' :
                      'bg-slate-400'
                    } ${!isActive && 'opacity-40'}`}></div>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              <tr>
                <th className="px-4 py-3">Comment</th>
                <th className="px-4 py-3 text-center">Sentiment</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {filteredComments.length > 0 ? (
                filteredComments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-slate-50 transition-colors rounded-xl border border-transparent hover:border-slate-200 group">
                    <td className="px-4 py-4 text-slate-700 max-w-md truncate rounded-l-xl">{comment.text}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          comment.sentiment === 'positive' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          comment.sentiment === 'negative' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {comment.sentiment === 'positive' && <Smile size={12} />}
                          {comment.sentiment === 'negative' && <Frown size={12} />}
                          {comment.sentiment === 'neutral' && <Meh size={12} />}
                          {comment.sentiment}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 text-xs">{comment.source}</td>
                    <td className="px-4 py-4 text-slate-500 text-xs font-mono rounded-r-xl">{comment.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                    No comments found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
