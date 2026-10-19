import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User, Check } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskAI: (prompt: string) => Promise<{ text: string }>;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onAskAI,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Привет! Я AI-помощник по настройке игрового сервера на 15 человек AetherCraft. Чем я могу помочь? Могу подсказать команды Git, параметры оптимизации ОЗУ или как подключить друзей к серверу в игре.',
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || promptInput;
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setPromptInput('');
    setLoading(true);

    try {
      const res = await onAskAI(textToSend);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'Для публикации сервера загрузите сгенерированный ZIP в ваш GitHub репозиторий, выполните `docker-compose up -d` и подключайтесь по адресу `play.aethercraft.gg:25565`.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Как сделать git push репозитория на GitHub?',
    'Как друзьям подключиться к моему серверу в игре?',
    'Как оптимизировать моды для 15 слотов?',
    'Как настроить голосовой чат Simple Voice Chat?',
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full h-[600px] flex flex-col justify-between shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Помощник AetherCraft</h3>
              <p className="text-[10px] text-slate-400">Powered by Gemini 3.8 Flash</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 text-xs font-bold">
                  AI
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 text-xs font-bold">
                  Вы
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 italic bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>AI генерирует ответ...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts & Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(qp)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                {qp}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Спросите AI про настройки сервера, моды или GitHub..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={loading || !promptInput.trim()}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Отправить</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
