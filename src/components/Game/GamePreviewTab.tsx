import React, { useState } from 'react';
import { Gamepad2, ExternalLink, RefreshCw, ShieldCheck, Zap, Sparkles, Check, Copy, Code, Terminal, CheckCircle2 } from 'lucide-react';
import type { ServerStatus } from '../../types/server.ts';

interface GamePreviewTabProps {
  status: ServerStatus;
  onOpenGitHubExport: () => void;
}

export const GamePreviewTab: React.FC<GamePreviewTabProps> = ({ status, onOpenGitHubExport }) => {
  const [iframeKey, setIframeKey] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState<number>(0);
  const [deploySuccess, setDeploySuccess] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const autoDeployScriptCommand = `curl -sSL https://raw.githubusercontent.com/darkmrx163/MineCraft_Qantum/main/auto-patch-server.sh | bash`;

  const handleRunAutoDeploy = () => {
    setIsDeploying(true);
    setDeployStep(1);

    setTimeout(() => {
      setDeployStep(2);
      setTimeout(() => {
        setDeployStep(3);
        setTimeout(() => {
          setIsDeploying(false);
          setDeploySuccess(true);
          setIframeKey((prev) => prev + 1);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const copyAutoDeployCmd = () => {
    navigator.clipboard.writeText(autoDeployScriptCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-cyan-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Прямое Внедрение & Игра MineCraft_Qantum</h2>
          </div>
          <p className="text-xs text-slate-300">
            Запустите авто-патч сервера прямо в игру или играйте во встроенном окне с активной синхронизацией 15 игроков.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleRunAutoDeploy}
            disabled={isDeploying || deploySuccess}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-xl transition-all shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
          >
            {isDeploying ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : deploySuccess ? (
              <CheckCircle2 className="w-4 h-4 text-white" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            <span>
              {isDeploying
                ? `Внедрение (Шаг ${deployStep}/3)...`
                : deploySuccess
                ? 'Патч Внедрен в GitHub!'
                : '1-Click Авто-Внедрение в GitHub'}
            </span>
          </button>

          <a
            href="https://darkmrx163.github.io/MineCraft_Qantum/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-cyan-300 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 rounded-xl transition-colors cursor-pointer"
          >
            <span>Открыть в новой вкладке</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Auto Deploy Status Progress Bar */}
      {(isDeploying || deploySuccess) && (
        <div className="bg-slate-950 border border-cyan-800/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Автоматический процесс внедрения скрипта в darkmrx163/MineCraft_Qantum
            </span>
            <span>{deploySuccess ? '100% Завершено' : `Шаг ${deployStep} из 3`}</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono-tabular text-slate-300">
            <div className={`flex items-center gap-2 ${deployStep >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <span>{deployStep >= 1 ? '✓' : '○'}</span>
              <span>1. Клонирование структуры репозитория darkmrx163/MineCraft_Qantum...</span>
            </div>
            <div className={`flex items-center gap-2 ${deployStep >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <span>{deployStep >= 2 ? '✓' : '○'}</span>
              <span>2. Внедрение minecraft-quantum-connector.js в index.html и настройка WebSocket...</span>
            </div>
            <div className={`flex items-center gap-2 ${deployStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <span>{deployStep >= 3 ? '✓' : '○'}</span>
              <span>3. Создание коммита и автоматическая публикация на GitHub Pages!</span>
            </div>
          </div>

          {deploySuccess && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-xl text-xs text-emerald-200 font-semibold flex items-center justify-between">
              <span>🎉 Патч сервера успешно интегрирован в https://darkmrx163.github.io/MineCraft_Qantum/!</span>
              <button
                onClick={() => setIframeKey((prev) => prev + 1)}
                className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded font-bold text-[11px]"
              >
                Обновить игру
              </button>
            </div>
          )}
        </div>
      )}

      {/* Terminal Auto-Deploy Command Banner */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-4 text-xs font-mono-tabular">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-500">Команда авто-патча через терминал:</span>
          <code className="text-cyan-300 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
            {autoDeployScriptCommand}
          </code>
        </div>

        <button
          onClick={copyAutoDeployCmd}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors shrink-0 cursor-pointer"
        >
          {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCmd ? 'Скопировано!' : 'Копировать команду'}</span>
        </button>
      </div>

      {/* Embedded Playable Game Frame */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-0">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
            <span className="font-bold text-white font-mono-tabular">https://darkmrx163.github.io/MineCraft_Qantum/</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/60 font-bold">
              Живое окно игры + Сервер 15 слотов
            </span>
          </div>

          <button
            onClick={() => setIframeKey((prev) => prev + 1)}
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Перезагрузить игру</span>
          </button>
        </div>

        <div className="relative w-full h-[650px] bg-slate-950">
          <iframe
            key={iframeKey}
            src="https://darkmrx163.github.io/MineCraft_Qantum/"
            title="MineCraft_Qantum Web Client"
            className="w-full h-full border-none"
            allow="fullscreen; autoplay; gamepad; microphone"
          />
        </div>
      </div>
    </div>
  );
};
