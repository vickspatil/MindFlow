import React, { useState } from 'react';
import { generateCurriculum } from './services/perplexity';
import { AppStatus, Curriculum, DifficultyLevel } from './types';
import { BrainCircuit, Sparkles, BookOpen, GitGraph, GraduationCap, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import ConceptCard from './components/ConceptCard';
import InteractiveFlowchart from './components/InteractiveFlowchart';
import Quiz from './components/Quiz';

function App() {
  const [status, setStatus] = useState<AppStatus>('IDLE');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.UNDERGRAD);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [activeTab, setActiveTab] = useState<'concepts' | 'flow' | 'quiz'>('concepts');

  const handleStart = async () => {
    if (!topic.trim()) return;
    setStatus('GENERATING');
    try {
      const result = await generateCurriculum(topic, difficulty);
      setCurriculum(result);
      setStatus('READY');
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  const handleDeepDiveSelect = async (selectedTopic: string) => {
    setStatus('GENERATING');
    setTopic(selectedTopic);
    try {
      const result = await generateCurriculum(selectedTopic, difficulty);
      setCurriculum(result);
      setStatus('READY');
      setActiveTab('concepts'); // Start with concepts tab for the new topic
    } catch (error) {
      console.error(error);
      setStatus('ERROR');
    }
  };

  const renderContent = () => {
    if (!curriculum) return null;

    switch (activeTab) {
      case 'concepts':
        return (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {curriculum.concepts.map((concept, idx) => (
              <ConceptCard key={concept.id} concept={concept} index={idx} />
            ))}
          </div>
        );
      case 'flow':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <InteractiveFlowchart nodes={curriculum.flowchart.nodes} edges={curriculum.flowchart.edges} />
          </div>
        );
      case 'quiz':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-2xl mx-auto">
            <Quiz 
              questions={curriculum.quiz} 
              currentTopic={curriculum.topic}
              difficulty={difficulty}
              onDeepDiveSelect={handleDeepDiveSelect}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setStatus('IDLE')}
          >
            <div className="bg-gradient-to-tr from-cyan-500 to-blue-600 p-2 rounded-lg">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">MindFlow</span>
          </div>
          {status === 'READY' && (
            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400 bg-slate-900 py-1.5 px-4 rounded-full border border-slate-800">
              <span className="text-white">{curriculum?.topic}</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
              <span className="text-cyan-400">{difficulty}</span>
            </div>
          )}
        </div>
      </header>

      <main className="pt-24 pb-20 px-4 min-h-screen flex flex-col items-center justify-center">
        
        {/* IDLE STATE */}
        {status === 'IDLE' && (
          <div className="w-full max-w-xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 pb-2">
                What do you want to learn?
              </h1>
              <p className="text-slate-400 text-lg">
                Adaptive AI that creates custom visual courses in seconds.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-6 rounded-2xl shadow-2xl space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Quantum Physics, French Revolution, React Hooks..."
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Depth Level</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.values(DifficultyLevel).map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`
                        p-3 rounded-xl border text-left text-sm font-medium transition-all
                        ${difficulty === level 
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' 
                          : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                        }
                      `}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleStart}
                disabled={!topic.trim()}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 text-lg"
              >
                <Sparkles size={20} />
                Generate Course
              </button>
            </div>
            
            <div className="flex justify-center gap-6 text-slate-600 text-sm">
               <span className="flex items-center gap-1"><BrainCircuit size={14}/> AI Powered</span>
               <span className="flex items-center gap-1"><GraduationCap size={14}/> Expert Curriculum</span>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {status === 'GENERATING' && (
          <div className="flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-1000">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 rounded-full animate-pulse-slow"></div>
              <BrainCircuit className="text-cyan-400 w-24 h-24 animate-float relative z-10" />
            </div>
            <div className="space-y-3 max-w-md">
              <h2 className="text-2xl font-bold text-white">Structuring knowledge...</h2>
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <Loader2 className="animate-spin" size={16} />
                <p>Analyzing depth for {difficulty}</p>
              </div>
              <p className="text-sm text-slate-500 pt-4">
                "Learning never exhausts the mind." <br/>— Leonardo da Vinci
              </p>
            </div>
          </div>
        )}

        {/* READY STATE */}
        {status === 'READY' && curriculum && (
          <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-700">
            
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/20 transition-colors duration-1000"></div>
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold mb-2">
                   <Sparkles size={14} /> AI Generated Course
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                  {curriculum.topic}
                </h1>
                <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
                  {curriculum.introduction}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              <div className="w-full md:w-64 flex-shrink-0 space-y-2 sticky top-24">
                <button
                  onClick={() => setActiveTab('concepts')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'concepts' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <BookOpen size={20} /> Concepts
                </button>
                <button
                  onClick={() => setActiveTab('flow')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'flow' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <GitGraph size={20} /> Visual Map
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'quiz' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <GraduationCap size={20} /> Quiz
                </button>

                <div className="pt-8 opacity-50">
                   <div className="h-px bg-slate-700 mb-4"></div>
                   <p className="text-xs text-slate-500 px-2">Progress is not saved. Refreshing will reset the course.</p>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                {renderContent()}
              </div>

            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'ERROR' && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="bg-red-500/10 p-6 rounded-full inline-block">
              <AlertCircle className="text-red-500 w-12 h-12" />
            </div>
            <h3 className="text-2xl font-bold text-white">Something went wrong</h3>
            <p className="text-slate-400">We couldn't generate the course at this time. Please try a different topic or try again later.</p>
            <button
              onClick={() => setStatus('IDLE')}
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;