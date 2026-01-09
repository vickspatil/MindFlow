import React, { useState, useEffect } from 'react';
import { QuizQuestion, DifficultyLevel } from '../types';
import { CheckCircle, XCircle, RefreshCw, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { generateDeepDiveTopics } from '../services/perplexity';

interface Props {
  questions: QuizQuestion[];
  currentTopic: string;
  difficulty: DifficultyLevel;
  onDeepDiveSelect?: (topic: string) => void;
}

const Quiz: React.FC<Props> = ({ questions, currentTopic, difficulty, onDeepDiveSelect }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [deepDiveTopics, setDeepDiveTopics] = useState<string[]>([]);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  const currentQuestion = questions[currentQuestionIdx];

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(p => p + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowSummary(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowSummary(false);
    setDeepDiveTopics([]);
  };

  useEffect(() => {
    const fetchDeepDiveTopics = async () => {
      const percentage = Math.round((score / questions.length) * 100);
      if (showSummary && percentage > 80 && deepDiveTopics.length === 0 && !loadingDeepDive) {
        setLoadingDeepDive(true);
        try {
          const topics = await generateDeepDiveTopics(currentTopic, difficulty);
          setDeepDiveTopics(topics);
        } catch (error) {
          console.error('Failed to generate deep-dive topics:', error);
        } finally {
          setLoadingDeepDive(false);
        }
      }
    };

    fetchDeepDiveTopics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSummary, score, questions.length, currentTopic, difficulty]);

  const handleDeepDiveClick = (topic: string) => {
    if (onDeepDiveSelect) {
      onDeepDiveSelect(topic);
    }
  };

  if (showSummary) {
    const percentage = Math.round((score / questions.length) * 100);
    const showDeepDive = percentage > 80;

    return (
      <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 text-center space-y-6">
        <h3 className="text-3xl font-display font-bold text-white">Quiz Completed!</h3>
        <div className="text-6xl font-bold text-cyan-400">
          {percentage}%
        </div>
        <p className="text-slate-400">
          You got <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span> correct.
        </p>

        {showDeepDive && (
          <div className="mt-8 pt-8 border-t border-slate-700 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
                <Sparkles size={14} /> Excellent Work!
              </div>
              <h4 className="text-xl font-bold text-white mt-4">
                Ready to dive deeper?
              </h4>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                You've mastered the basics! Explore these advanced topics to fuel your curiosity and expand your knowledge.
              </p>
            </div>

            {loadingDeepDive ? (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="animate-spin text-cyan-400" size={24} />
                <p className="text-slate-400 text-sm">Finding exciting topics for you...</p>
              </div>
            ) : deepDiveTopics.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                {deepDiveTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDeepDiveClick(topic)}
                    className="group relative text-left p-4 rounded-xl border-2 border-slate-700 hover:border-cyan-500 bg-slate-900/50 hover:bg-slate-900 transition-all duration-200 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-200"></div>
                    <div className="relative flex items-center justify-between">
                      <span className="text-white font-medium pr-8">{topic}</span>
                      <ArrowRight className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" size={20} />
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}

        <div className="flex gap-3 justify-center pt-4">
          <button 
            onClick={resetQuiz}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-colors"
          >
            <RefreshCw size={20} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-700">
      <div className="flex justify-between items-center mb-6">
        <span className="text-slate-500 font-mono text-sm uppercase tracking-wider">
          Question {currentQuestionIdx + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
             <div 
               key={idx} 
               className={`h-1.5 w-6 rounded-full transition-colors ${idx <= currentQuestionIdx ? 'bg-cyan-500' : 'bg-slate-700'}`}
             />
          ))}
        </div>
      </div>

      <h3 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-tight">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => {
          let styleClass = "border-slate-600 hover:border-slate-500 text-slate-300";
          if (isAnswered) {
             if (idx === currentQuestion.correctIndex) {
               styleClass = "bg-emerald-900/30 border-emerald-500 text-emerald-100";
             } else if (idx === selectedOption) {
               styleClass = "bg-rose-900/30 border-rose-500 text-rose-100";
             } else {
               styleClass = "border-slate-700 text-slate-500 opacity-50";
             }
          } else if (selectedOption === idx) {
             styleClass = "border-cyan-500 bg-cyan-900/20 text-white";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between group ${styleClass}`}
            >
              <span>{option}</span>
              {isAnswered && idx === currentQuestion.correctIndex && <CheckCircle className="text-emerald-500" size={20} />}
              {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && <XCircle className="text-rose-500" size={20} />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border-l-4 border-cyan-500">
            <h4 className="text-cyan-400 font-semibold mb-1">Explanation</h4>
            <p className="text-slate-300 text-sm">{currentQuestion.explanation}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold transition-colors"
            >
              {currentQuestionIdx === questions.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;