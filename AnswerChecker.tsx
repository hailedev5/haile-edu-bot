import React, { useState, useRef, useEffect } from 'react';
import { BackIcon, AnswerCheckerIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';
import { checkAnswer } from '../services/geminiService';
import type { Model } from '../types';

const AnswerChecker: React.FC<{ onBack: () => void; model: Model }> = ({ onBack, model }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t, language } = useI18n();
  const resultRef = useRef<HTMLDivElement>(null);

  const formatContent = (content: string) => {
    return content.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre class="bg-black/20 p-3 rounded-md overflow-x-auto text-sm my-2"><code>${code.trim()}</code></pre>`;
    }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold my-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      .replace(/(\n\s*-\s)/g, '<br/>&bull; ')
      .replace(/\n/g, '<br />');
  };

  useEffect(() => {
    if (resultRef.current && (window as any).renderMathInElement) {
      (window as any).renderMathInElement(resultRef.current, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
        ],
        throwOnError: false
      });
    }
  }, [result]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || isLoading) return;

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const evaluation = await checkAnswer(model, question, answer, language);
      setResult(evaluation);
    } catch (err) {
      setError(t('answerCheckerError'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setAnswer('');
    setResult('');
    setError('');
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-2 mr-2">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">{t('answerCheckerHeader')}</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-6">
        <div className="w-full text-center">
          <AnswerCheckerIcon className="w-20 h-20 text-[var(--accent-primary)] mx-auto mb-6" />
          <h2 className="text-2xl font-semibold mb-2">{t('answerCheckerTitle')}</h2>
          <p className="text-[var(--text-secondary)] mb-8">{t('answerCheckerSubtitle')}</p>

          {!result && !isLoading && (
            <form onSubmit={handleSubmit} className="w-full space-y-4 text-left animate-slide-in-up">
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('answerCheckerQuestionLabel')}</label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={t('answerCheckerQuestionPlaceholder')}
                  className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg py-2 px-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
                  rows={3}
                  aria-label={t('answerCheckerQuestionLabel')}
                />
              </div>
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('answerCheckerAnswerLabel')}</label>
                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder={t('answerCheckerAnswerPlaceholder')}
                  className="w-full bg-[var(--background-secondary)] border border-[var(--border-color)] rounded-lg py-2 px-3 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none"
                  rows={5}
                  aria-label={t('answerCheckerAnswerLabel')}
                />
              </div>
              <button
                type="submit"
                disabled={!question.trim() || !answer.trim()}
                className="w-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:from-[var(--accent-primary-hover)] hover:to-[var(--accent-secondary-hover)]"
              >
                {t('answerCheckerCheckButton')}
              </button>
            </form>
          )}

          {isLoading && (
            <div className="text-center py-10">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-3 h-3 bg-[var(--accent-primary)] rounded-full animate-pulse"></span>
              </div>
              <p className="mt-4 text-[var(--text-secondary)]">{t('answerCheckerChecking')}</p>
            </div>
          )}

          {error && <p className="text-sm text-[var(--destructive)] mt-4">{error}</p>}
          
          {result && !isLoading && (
            <div className="mt-8 text-left animate-slide-in-up">
              <h3 className="text-xl font-bold mb-4">{t('answerCheckerResultTitle')}</h3>
              <div className="bg-[var(--background-secondary)] p-4 rounded-lg space-y-2">
                <div
                  ref={resultRef}
                  className="prose prose-sm prose-p:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-headings:text-[var(--text-primary)] prose-li:text-[var(--text-secondary)] max-w-none" 
                  dangerouslySetInnerHTML={{ __html: formatContent(result) }} 
                />
              </div>
              <button
                onClick={handleReset}
                className="w-full mt-6 bg-[var(--background-secondary)] text-[var(--text-primary)] font-bold py-3 px-6 rounded-lg transition-all hover:bg-[var(--background-tertiary)]"
              >
                {t('answerCheckerAnotherButton')}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnswerChecker;