
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { createEduChatSession } from '../services/geminiService';
import type { Message, ChatSession, SavedMessage, Attachment, Model } from '../types';
import ChatMessage from './ChatMessage';
import { SendIcon, BackIcon, MicIcon, PaperclipIcon, XIcon, PdfIcon } from './Icons';
import { useI18n } from '../contexts/i18nContext';
import VoiceInputOverlay from './VoiceInputOverlay';

interface ChatInterfaceProps {
  session: ChatSession | null;
  initialQuery: string;
  onBack: () => void;
  isOnline: boolean;
  isInternetSavingMode: boolean;
  model: Model;
}

// Helper function to convert a File object to a GoogleGenerativeAI.Part object.
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: (await base64EncodedDataPromise) as string, mimeType: file.type },
  };
}


const ChatInterface: React.FC<ChatInterfaceProps> = ({ session, initialQuery, onBack, isOnline, isInternetSavingMode, model }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<Attachment | null>(null);
  const [sessionId, setSessionId] = useState<string>(`session-${Date.now()}`);
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(new Set());
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const { t, language } = useI18n();
  
  const chatSession = useRef<Chat | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialQuerySent = useRef(false);
  const finalTranscriptRef = useRef('');

  useEffect(() => {
    chatSession.current = createEduChatSession(model, language, session?.messages);
    
    const saved = JSON.parse(localStorage.getItem('savedMessages') || '[]') as SavedMessage[];
    setSavedMessageIds(new Set(saved.map(m => m.id)));

    if (session) {
      setMessages(session.messages);
      setSessionId(session.id);
      initialQuerySent.current = true;
    } else if (initialQuery && !initialQuerySent.current && chatSession.current) {
      initialQuerySent.current = true;
      sendMessage(initialQuery, null);
    }
  }, [initialQuery, session, language, model]);
  
    useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      console.error("Speech Recognition not supported by this browser.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscriptRef.current + interimTranscript);
    };

    recognition.onerror = (event: any) => {
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          console.error('Speech recognition error', event.error);
        }
        setIsRecording(false);
    }

    recognitionRef.current = recognition;
    
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, [language]);


  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  // Cleanup effect for speech synthesis
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleGoBack = () => {
    // Also stop speaking when leaving the chat
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const messagesToSave = messages.filter(m => !(m.role === 'model' && m.content.trim() === ''));

    if (messagesToSave.length > 0) {
      const firstUserMessage = messagesToSave.find(m => m.role === 'user');
      const newSession: ChatSession = {
        id: sessionId,
        title: firstUserMessage?.content.substring(0, 40) + '...' || t('newChat'),
        messages: messagesToSave,
        timestamp: Date.now()
      };

      const history = JSON.parse(localStorage.getItem('chatHistory') || '[]') as ChatSession[];
      const existingIndex = history.findIndex(s => s.id === newSession.id);

      if (existingIndex > -1) {
        history[existingIndex] = newSession;
      } else {
        history.push(newSession);
      }
      localStorage.setItem('chatHistory', JSON.stringify(history));
    }
    onBack();
  };
  
  const handleSaveMessage = (message: Message) => {
    const saved = JSON.parse(localStorage.getItem('savedMessages') || '[]') as SavedMessage[];
    const isAlreadySaved = saved.some(m => m.id === message.id);
    let updatedSaved: SavedMessage[];

    if (isAlreadySaved) {
      updatedSaved = saved.filter(m => m.id !== message.id);
      setSavedMessageIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(message.id);
        return newSet;
      });
    } else {
      updatedSaved = [...saved, { ...message, savedAt: Date.now() }];
      setSavedMessageIds(prev => new Set(prev).add(message.id));
    }
    localStorage.setItem('savedMessages', JSON.stringify(updatedSaved));
  };
  
  const handleSpeak = useCallback((message: Message) => {
    if (!message.content.trim() || !('speechSynthesis' in window)) return;

    // If we click the currently speaking message, stop it.
    if (window.speechSynthesis.speaking && currentlySpeakingId === message.id) {
        window.speechSynthesis.cancel();
        setCurrentlySpeakingId(null);
        return;
    }

    // If any other message is speaking, or if we're starting a new one, cancel the old one first.
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const strippedContent = message.content
      .replace(/<[^>]+>/g, '') // remove html tags
      .replace(/```[\s\S]*?```/g, t('speechCodeBlock'))
      .replace(/\$\$([\s\S]*?)\$\$/g, t('speechMathEquation'))
      .replace(/\$([\s\S]*?)\$/g, t('speechMathExpression'))
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
      .replace(/(\*|_)(.*?)\1/g, '$2')   // italic
      .replace(/#+\s/g, ''); // headings

    const utterance = new SpeechSynthesisUtterance(strippedContent);
    utterance.lang = language;
    utterance.onend = () => setCurrentlySpeakingId(null);
    utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setCurrentlySpeakingId(null);
    };
    
    setCurrentlySpeakingId(message.id);
    window.speechSynthesis.speak(utterance);
}, [language, currentlySpeakingId, t]);


  const sendMessage = async (messageText: string, file: File | null) => {
    if ((!messageText.trim() && !file) || !chatSession.current) return;
    
    setIsLoading(true);
    // Stop any speech when sending a new message
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingId(null);
    }

    let userMessageContent = messageText;
    const parts: any[] = [];
    if (file) {
        const filePart = await fileToGenerativePart(file);
        parts.push(filePart);
    }
    if (messageText.trim()) {
        parts.push({ text: messageText });
    } else if (file) {
        const defaultPrompt = t('userUpload');
        parts.push({ text: defaultPrompt });
        userMessageContent = defaultPrompt;
    }
    
    const userMessage: Message = { 
      id: `user-${Date.now()}`, 
      role: 'user', 
      content: userMessageContent, 
      attachment: attachmentPreview ?? undefined 
    };
    const botMessageId = `model-${Date.now()}`;

    setMessages(prev => [...prev, userMessage, { id: botMessageId, role: 'model', content: '' }]);
    setInput('');
    setAttachmentFile(null);
    setAttachmentPreview(null);

    try {
      const stream = await chatSession.current.sendMessageStream({ message: parts });
      
      let fullResponse = '';
      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId ? { ...msg, content: fullResponse } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId ? { ...msg, content: t('errorMessage') } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
    sendMessage(input, attachmentFile);
  };
  
  const handleMicButtonClick = async () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });

        finalTranscriptRef.current = '';
        setInput('');
        recognition.start();
      } catch (error) {
        console.error('Error requesting microphone permission:', error);
        if ((error as DOMException).name === 'NotAllowedError' || (error as DOMException).name === 'PermissionDeniedError') {
          alert(t('microphonePermissionError'));
        }
        setIsRecording(false);
      }
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (isImage || isPdf) {
        setAttachmentFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachmentPreview({
              name: file.name,
              type: isImage ? 'image' : 'pdf',
              dataUrl: reader.result as string
            });
        };
        reader.readAsDataURL(file);
      }
    }
    if (event.target) {
        event.target.value = '';
    }
  };


  return (
    <div className="flex flex-col h-screen bg-[var(--background-primary)] text-[var(--text-primary)] max-w-md mx-auto">
      <VoiceInputOverlay isVisible={isRecording} transcript={input} onClose={handleMicButtonClick} />
      <header className="flex items-center p-4 border-b border-[var(--border-color)]">
         <button onClick={handleGoBack} className="p-2 mr-2">
            <BackIcon className="w-6 h-6" />
         </button>
         <h1 className="text-lg font-bold">{t('chatHeader')}</h1>
      </header>
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            onSaveMessage={handleSaveMessage}
            isSaved={savedMessageIds.has(msg.id)}
            onSpeak={handleSpeak}
            isSpeaking={currentlySpeakingId === msg.id}
          />
        ))}
         {isLoading && messages.length > 0 && messages[messages.length-1].role === 'model' && (
           <ChatMessage key="loading" message={{id: 'loading', role: 'model', content: ''}} isLoading={true} />
        )}
      </div>
      <div className="p-4 bg-[var(--background-primary)] border-t border-[var(--border-color)]">
        {attachmentPreview && (
            <div className="relative mb-2 w-full">
              <div className="bg-[var(--background-secondary)] rounded-lg p-2 flex items-center gap-3">
                {attachmentPreview.type === 'image' ? (
                  <img src={attachmentPreview.dataUrl} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-[var(--background-tertiary)] rounded-md">
                    <PdfIcon className="w-8 h-8 text-[var(--text-secondary)]"/>
                  </div>
                )}
                <span className="text-sm text-[var(--text-secondary)] truncate flex-1">{attachmentPreview.name}</span>
                <button
                  onClick={() => { setAttachmentPreview(null); setAttachmentFile(null); }}
                  className="bg-gray-800/50 text-white rounded-full p-1"
                  aria-label={t('removeImage')}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        <form onSubmit={handleFormSubmit} className="relative">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*,application/pdf" />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleFormSubmit(e);
              }
            }}
            placeholder={!isOnline ? t('offlineInChat') : (isRecording ? t('listening') : t('chatPlaceholder'))}
            className="w-full pl-4 pr-36 py-3 rounded-lg bg-[var(--background-secondary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] resize-none disabled:opacity-60"
            rows={1}
            disabled={isLoading || !isOnline}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label={t('uploadFile')}
              className="p-2 disabled:opacity-50 text-[var(--text-secondary)] hover:text-[var(--accent-primary)]"
              disabled={isLoading || !isOnline || isInternetSavingMode}
              title={isInternetSavingMode ? t('settingsInternetSavingDesc') : ''}
            >
              <PaperclipIcon className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleMicButtonClick}
              aria-label="Use microphone"
              className="p-2 disabled:opacity-50"
              disabled={isLoading || !isOnline}
            >
              <MicIcon className={`w-6 h-6 transition-colors ${isRecording ? 'text-[var(--destructive)]' : 'text-[var(--accent-primary)]'}`} />
            </button>
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !attachmentFile) || !isOnline}
              className="p-2 rounded-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] disabled:bg-[var(--text-secondary)] disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
