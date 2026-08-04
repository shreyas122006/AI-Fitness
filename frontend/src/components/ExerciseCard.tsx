import React, { useState } from 'react';
import { 
  Dumbbell, Target, Layers, Flame, Copy, Check, Download, Bookmark, BookmarkCheck, 
  ChevronDown, ChevronUp, AlertCircle, ShieldAlert, Sparkles, CheckCircle2, XCircle
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Exercise } from '../types';

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite: boolean;
  onToggleFavorite: (exercise: Exercise) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isFavorite,
  onToggleFavorite,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'instructions'>('summary');
  const [expanded, setExpanded] = useState(true);

  const { name, bodyPart, target, equipment, secondaryMuscles, gifUrl, summary } = exercise;

  // Copy AI Summary text formatted cleanly to clipboard
  const handleCopySummary = () => {
    if (!summary) return;

    const summaryText = `
Exercise Name: ${summary.exercise || name}
Body Parts Trained: ${bodyPart}
Target Muscle: ${target}
Equipment Required: ${equipment}
Recommended Frequency: ${summary.frequency || 'N/A'}
Difficulty Level: ${summary.difficulty || 'N/A'}
Calories Burned: ${summary.calories || 'N/A'}
Suitable For: ${summary.suitable || 'N/A'}

PROS:
${summary.pros?.map(p => `• ${p}`).join('\n') || 'N/A'}

CONS:
${summary.cons?.map(c => `• ${c}`).join('\n') || 'N/A'}

FORM & TECHNIQUE:
${summary.technique?.map(t => `• ${t}`).join('\n') || 'N/A'}

COMMON MISTAKES:
${summary.mistakes?.map(m => `• ${m}`).join('\n') || 'N/A'}

MEDICAL PRECAUTIONS:
${summary.medical?.map(med => `• ${med}`).join('\n') || 'N/A'}
    `.trim();

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    onShowToast('Copied Exercise Summary to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Summary as PDF
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(`Fitness Trainer Report: ${name.toUpperCase()}`, 14, 20);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Category: ${bodyPart} | Target: ${target} | Equipment: ${equipment}`, 14, 28);
      doc.line(14, 32, 196, 32);

      let yPos = 40;
      const addSection = (title: string, items: string[] | string) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(title, 14, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        if (Array.isArray(items)) {
          items.forEach(item => {
            const splitText = doc.splitTextToSize(`• ${item}`, 175);
            doc.text(splitText, 18, yPos);
            yPos += splitText.length * 5;
          });
        } else {
          const splitText = doc.splitTextToSize(items, 18);
          doc.text(splitText, 18, yPos);
          yPos += splitText.length * 5;
        }
        yPos += 4;
      };

      if (summary) {
        addSection('Frequency & Intensity:', summary.frequency || 'N/A');
        addSection('Difficulty Level & Calories:', `${summary.difficulty} | ${summary.calories}`);
        addSection('Suitable For:', summary.suitable || 'N/A');
        if (summary.pros?.length) addSection('Pros & Benefits:', summary.pros);
        if (summary.cons?.length) addSection('Cons & Considerations:', summary.cons);
        if (summary.technique?.length) addSection('Form & Technique Steps:', summary.technique);
        if (summary.mistakes?.length) addSection('Common Mistakes to Avoid:', summary.mistakes);
        if (summary.medical?.length) addSection('Medical Precautions:', summary.medical);
      }

      doc.save(`${name.toLowerCase().replace(/\s+/g, '_')}_fitness_summary.pdf`);
      onShowToast('Downloaded PDF summary successfully!', 'success');
    } catch (e) {
      console.error(e);
      onShowToast('Could not generate PDF download.', 'error');
    }
  };

  return (
    <div className="w-full glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-xl hover:shadow-2xl hover:border-slate-700/80 transition-all duration-300 transform hover:-translate-y-1">
      
      {/* Top Header Banner */}
      <div className="p-5 sm:p-6 bg-slate-900/90 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          
          {/* Exercise Visual Image / GIF */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-950 p-1 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center">
            {gifUrl ? (
              <img 
                src={gifUrl} 
                alt={name} 
                className="w-full h-full object-cover rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <Dumbbell className="w-8 h-8 text-emerald-400" />
            )}
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight capitalize">
              {name}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Target className="w-3.5 h-3.5 mr-1" /> {target}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Dumbbell className="w-3.5 h-3.5 mr-1" /> {equipment}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                <Layers className="w-3.5 h-3.5 mr-1" /> {bodyPart}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-end md:self-auto">
          {/* Favorite Toggle */}
          <button
            onClick={() => onToggleFavorite(exercise)}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
              isFavorite
                ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            {isFavorite ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>

          {/* Copy Summary */}
          <button
            onClick={handleCopySummary}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center justify-center"
            title="Copy AI Summary"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </button>

          {/* Download PDF */}
          <button
            onClick={handleDownloadPDF}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center justify-center"
            title="Download Summary as PDF"
          >
            <Download className="w-5 h-5" />
          </button>

          {/* Toggle Expand */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center justify-center"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Expandable Body */}
      {expanded && (
        <div className="p-5 sm:p-6 space-y-6">

          {/* Secondary Muscles & Badges */}
          {secondaryMuscles && secondaryMuscles.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Secondary Muscles:</span>
              {secondaryMuscles.map((sec) => (
                <span key={sec} className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 capitalize">
                  {sec}
                </span>
              ))}
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
                activeTab === 'summary'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Trainer Summary</span>
            </button>
            {exercise.instructions && exercise.instructions.length > 0 && (
              <button
                onClick={() => setActiveTab('instructions')}
                className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
                  activeTab === 'instructions'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Step-by-Step Instructions</span>
              </button>
            )}
          </div>

          {/* Tab Content 1: AI Summary */}
          {activeTab === 'summary' && summary && (
            <div className="space-y-6 animate-fadeIn">

              {/* Top Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Flame className="w-3.5 h-3.5 mr-1 text-amber-400" /> Recommended Frequency
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {summary.frequency || '2–3 times per week'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Target className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Difficulty & Calories
                  </div>
                  <div className="text-xs font-semibold text-slate-200">
                    {summary.difficulty || 'Intermediate'} • {summary.calories || '50-80 kcal'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-400" /> Suitable For
                  </div>
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {summary.suitable || 'Hypertrophy & Strength'}
                  </div>
                </div>
              </div>

              {/* Pros & Cons Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Pros */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Key Pros & Benefits
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {summary.pros?.map((pro, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-emerald-400 mr-2 font-bold">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/40">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-3 flex items-center">
                    <XCircle className="w-4 h-4 mr-1.5" /> Cons & Limitations
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {summary.cons?.map((con, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-rose-400 mr-2 font-bold">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Form & Technique */}
              {summary.technique && summary.technique.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3 flex items-center">
                    <Target className="w-4 h-4 mr-1.5" /> Form & Technique Tips
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {summary.technique.map((step, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-400 mr-2 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes & Medical Precautions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Common Mistakes */}
                {summary.mistakes && summary.mistakes.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1.5" /> Common Mistakes
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {summary.mistakes.map((mistake, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-amber-400 mr-2 font-bold">•</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Medical Precautions */}
                {summary.medical && summary.medical.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
                      <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-400" /> Medical Precautions
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {summary.medical.map((med, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-rose-400 mr-2 font-bold">•</span>
                          <span>{med}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* Tab Content 2: Raw Instructions */}
          {activeTab === 'instructions' && exercise.instructions && (
            <div className="space-y-3 animate-fadeIn">
              <ol className="space-y-2 text-xs text-slate-300">
                {exercise.instructions.map((inst, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center shrink-0 mr-3 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5">{inst}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
