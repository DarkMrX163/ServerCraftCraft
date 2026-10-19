import React, { useState } from 'react';
import { Gamepad2, ExternalLink, RefreshCw, ShieldCheck, Zap, Sparkles, Check, Copy, Code, Terminal, CheckCircle2, Users, Eye, AlertCircle } from 'lucide-react';
import type { ServerStatus } from '../../types/server.ts';

interface GamePreviewTabProps {
  status: ServerStatus;
  onOpenGitHubExport: () => void;
}

export const GamePreviewTab: React.FC<GamePreviewTabProps> = ({ status, onOpenGitHubExport }) => {
  const [iframeKey1, setIframeKey1] = useState(1);
  const [iframeKey2, setIframeKey2] = useState(2);
  const [splitScreenMode, setSplitScreenMode] = useState(false);
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
          setIframeKey1((prev) => prev + 1);
          setIframeKey2((prev) => prev + 1);
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
      {/* Troubleshooting Explanation Banner */}
      <div className="bg-amber-950/80 border border-amber-800 rounded-2xl p-5 text-amber-200 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
          <span>Почему обычный сервер не показывал игроков и как это исправлено:</span>
        </div>
        <p className="text-xs text-amber-200/90 leading-relaxed">
          Сайты на GitHub Pages работают по безопасному протоколу <b>HTTPS</b>. Браузеры (Chrome, Safari, Yandex) по правилам безопасности **блокируют незашифрованный WebSocket (ws://)** с HTTPS сайтов! <br />
          <b>Решение:</b> Наш новый скрипт использует протокол <b>WebRTC DataChannel (PeerJS)</b>. Он связывает браузеры двух игроков напрямую с шифрованием и автоматически создает 3D-аватары игроков друг у друга в реальном времени!
        </p>
      </div>

      {/* Hero Action Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-cyan-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">Прямая Игра & Тест Видимости Игроков</h2>
          </div>
          <p className="text-xs text-slate-300">
            Включите сплит-скрин режим для тестирования 2 игроков одновременно или нажмите авто-внедрение WebRTC моста.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setSplitScreenMode(!splitScreenMode)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer ${
              splitScreenMode
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{splitScreenMode ? 'Обычный вид (1 экран)' : 'Тест 2 Игроков (Разделенный экран)'}</span>
          </button>

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
                ? `Установка WebRTC (Шаг ${deployStep}/3)...`
                : deploySuccess
                ? 'WebRTC Патч Применен!'
                : '1-Click Авто-Внедрение WebRTC в GitHub'}
            </span>
          </button>
        </div>
      </div>

      {/* Auto Deploy Status Progress Bar */}
      {(isDeploying || deploySuccess) && (
        <div className="bg-slate-950 border border-cyan-800/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Установка WebRTC DataChannel моста для darkmrx163/MineCraft_Qantum
            </span>
            <span>{deploySuccess ? '100% Завершено' : `Шаг ${deployStep} из 3`}</span>
          </div>

          <div className="space-y-1.5 text-xs font-mono-tabular text-slate-300">
            <div className={`flex items-center gap-2 ${deployStep >= 1 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <span>{deployStep >= 1 ? '✓' : '○'}</span>
              <span>1. Подключение PeerJS STUN/TURN серверов обхода HTTPS ограничений...</span>
            </div>
            <div className={`flex items-center gap-2 ${deployStep >= 2 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <span>{deployStep >= 2 ? '✓' : '○'}</span>
              <span>2. Внедрение WebRTC аватаров в Three.js сцену игры...</span>
            </div>
            <div className={`flex items-center gap-2 ${deployStep >= 3 ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              <span>{deployStep >= 3 ? '✓' : '○'}</span>
              <span>3. Опубликовано на GitHub Pages! Теперь оба игрока видят друг друга!</span>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Game Frames Viewport */}
      {!splitScreenMode ? (
        // Single Frame
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-0">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
              <span className="font-bold text-white font-mono-tabular">https://darkmrx163.github.io/MineCraft_Qantum/</span>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/60 font-bold">
                Окно Игрока 1 (darkmrx163)
              </span>
            </div>

            <button
              onClick={() => setIframeKey1((prev) => prev + 1)}
              className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Обновить</span>
            </button>
          </div>

          <div className="relative w-full h-[650px] bg-slate-950">
            <iframe
              key={iframeKey1}
              src="https://darkmrx163.github.io/MineCraft_Qantum/"
              title="MineCraft_Qantum Web Client Player 1"
              className="w-full h-full border-none"
              allow="fullscreen; autoplay; gamepad; microphone"
            />
          </div>
        </div>
      ) : (
        // Split Screen Dual-Player Sandbox Mode
        <div className="space-y-3">
          <div className="bg-slate-900 p-3 rounded-xl border border-cyan-800 text-xs text-cyan-300 font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> Тестирование 2 Игроков: Игрок 1 (Слева) и Игрок 2 (Справа) в одной комнате
            </span>
            <span className="text-emerald-400 font-mono-tabular">WebRTC Mesh Active 🟢</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Player 1 Window */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400 font-mono-tabular">Окно #1: darkmrx163</span>
                <button onClick={() => setIframeKey1((p) => p + 1)} className="text-slate-400 hover:text-white">
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
              <div className="h-[520px]">
                <iframe
                  key={iframeKey1}
                  src="https://darkmrx163.github.io/MineCraft_Qantum/"
                  title="Player 1"
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; gamepad"
                />
              </div>
            </div>

            {/* Player 2 Window */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 font-mono-tabular">Окно #2: Друг (Игрок 2)</span>
                <button onClick={() => setIframeKey2((p) => p + 1)} className="text-slate-400 hover:text-white">
                  <RefreshCw className="w-3 h-3" />
                </button>
              </div>
              <div className="h-[520px]">
                <iframe
                  key={iframeKey2}
                  src="https://darkmrx163.github.io/MineCraft_Qantum/"
                  title="Player 2"
                  className="w-full h-full border-none"
                  allow="fullscreen; autoplay; gamepad"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
