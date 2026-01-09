import React, { useState } from 'react';
import { Concept } from '../types';
import { Lightbulb, BookOpen, ArrowRight } from 'lucide-react';

interface Props {
  concept: Concept;
  index: number;
}

const ConceptCard: React.FC<Props> = ({ concept, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl transition-all duration-300 border
        ${isExpanded ? 'bg-slate-800/80 border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.15)]' : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'}
      `}
    >
      <div className="p-6 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full font-display font-bold text-lg
              ${isExpanded ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'}
            `}>
              {index + 1}
            </div>
            <h3 className="text-xl font-display font-bold text-white">{concept.title}</h3>
          </div>
          <button className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
            <ArrowRight size={20} />
          </button>
        </div>

        <p className={`mt-4 text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
          {concept.definition}
        </p>
      </div>

      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="p-6 pt-0 space-y-4">
          <div className="bg-indigo-900/30 rounded-xl p-4 border border-indigo-500/20">
            <div className="flex items-center gap-2 text-indigo-400 mb-2 font-semibold">
              <Lightbulb size={18} />
              <span>Analogy</span>
            </div>
            <p className="text-indigo-100 italic">"{concept.analogy}"</p>
          </div>
          
          <div className="bg-emerald-900/30 rounded-xl p-4 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-400 mb-2 font-semibold">
              <BookOpen size={18} />
              <span>Key Takeaway</span>
            </div>
            <p className="text-emerald-100">{concept.keyTakeaway}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptCard;