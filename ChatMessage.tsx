import React, { useRef, useEffect, useState } from 'react';
import type { Message } from '../types';
import { RobotIcon, UserIcon, BookmarkIcon, PdfIcon, SpeakerIcon, CopyIcon, CheckIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
  onSaveMessage?: (message: Message) => void;
  isSaved?: boolean;
  onSpeak?: (message: Message) => void;
  isSpeaking?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false, onSaveMessage, isSaved, onSpeak, isSpeaking }) => {
  const isUser = message.role === 'user';
  const { t } = useI18n();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const formattedContent = message.content.replace(/```([\s\S]*?)```/g, (match, code) => {
    return `<pre class="bg-black/20 p-3 rounded-md overflow-x-auto text-sm my-2"><code>${code.trim()}</code></pre>`;
  }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold my-2">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold my-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold my-4">$1</h1>')
    .replace(/(\n\s*-\s)/g, '<br/>&bull; ')
    .replace(/\n/g, '<br />');
    
  useEffect(() => {
    if (contentRef.current && (window as any).renderMathInElement) {
      (window as any).renderMathInElement(contentRef.current, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false},
        ],
        throwOnError: false
      });
    }
  }, [message.content]);

  const handleCopy = () => {
    if (navigator.clipboard && message.content) {
      navigator.clipboard.writeText(message.content).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy text:', err);
      });
    }
  };


  return (
    <div className={`group flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--background-secondary)] flex items-center justify-center border border-[var(--border-color)]">
          <RobotIcon className="w-7 h-7 text-[var(--accent-primary)]" />
        </div>
      )}
      <div 
        className={`max-w-xs md:max-w-md rounded-2xl ${
          isUser 
            ? 'bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white rounded-br-none' 
            : 'bg-[var(--background-secondary)] text-[var(--text-primary)] rounded-bl-none'
        }`}
      >
        {isUser && message.attachment && (
            message.attachment.type === 'image' ? (
                <img src={message.attachment.dataUrl} alt={t('userUpload')} className="w-full h-auto object-cover rounded-t-2xl" />
            ) : (
                <div className="p-3 flex items-center gap-2 bg-black/10 rounded-t-2xl border-b border-white/20">
                    <PdfIcon className="w-6 h-6 text-white flex-shrink-0" />
                    <span className="text-sm font-medium truncate" title={message.attachment.name}>
                        {message.attachment.name}
                    </span>
                </div>
            )
        )}
         <div className="px-4 py-3" style={{ overflowWrap: 'break-word' }}>
            {isLoading ? (
                <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-[var(--accent-primary)] rounded-full animate-pulse"></span>
                </div>
            ) : (
              message.content.trim() &&
              <div 
                ref={contentRef}
                className="prose prose-sm prose-p:text-[var(--text-primary)] prose-strong:text-[var(--text-primary)] prose-headings:text-[var(--text-primary)] prose-li:text-[var(--text-secondary)]" 
                dangerouslySetInnerHTML={{ __html: formattedContent }} 
              />
            )}
         </div>
      </div>
       {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-[var(--text-secondary)]" />
        </div>
      )}
      {!isUser && !isLoading && (
        <div className="flex-shrink-0 self-center flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-1">
          {onSaveMessage && (
            <button 
                onClick={() => onSaveMessage(message)} 
                className="p-2 rounded-full hover:bg-white/10"
                aria-label={isSaved ? t('unsaveMessage') : t('saveMessage')}
            >
                <BookmarkIcon className={`w-5 h-5 ${isSaved ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`} filled={isSaved} />
            </button>
          )}
          {onSpeak && message.content.trim() && (
            <button
                onClick={() => onSpeak(message)}
                className="p-2 rounded-full hover:bg-white/10"
                aria-label={isSpeaking ? t('stopSpeaking') : t('readAloud')}
            >
                <SpeakerIcon className={`w-5 h-5 ${isSpeaking ? 'text-[var(--accent-primary)]' : 'text-[var(--text-secondary)]'}`} isSpeaking={isSpeaking} />
            </button>
          )}
           {message.content.trim() && (
            <button
                onClick={handleCopy}
                className="p-2 rounded-full hover:bg-white/10"
                aria-label={isCopied ? t('copied') : t('copy')}
            >
                {isCopied ? (
                    <CheckIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                ) : (
                    <CopyIcon className="w-5 h-5 text-[var(--text-secondary)]" />
                )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;