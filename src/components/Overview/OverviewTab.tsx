import React, { useState } from 'react';
import { Cpu, HardDrive, Activity, Users, ShieldCheck, UserPlus, Zap, Clock, ExternalLink, ShieldAlert, Check, Copy } from 'lucide-react';
import type { ServerStatus, PlayerSlot } from '../../types/server.ts';
import { PlayerCard } from './PlayerCard.tsx';

interface OverviewTabProps {
  status: ServerStatus;
  slots: PlayerSlot[];
  onPlayerAction: (slotNumber: number, action: 'kick' | 'ban' | 'toggle_op' | 'add_whitelist', username?: string, reason?: string) => void;
  onOpenGitHubExport: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  status,
  slots,
  onPlayerAction,
  onOpenGitHubExport,
}) => {
  const [showWhitelistModal, setShowWhitelistModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h} ч. ${m} мин.`;
  };

  const memPercent = Math.round((status.memoryUsedMB / status.memoryMaxMB) * 100);

  const copyGameUrl = () => {
    navigator.clipboard.writeText('https://darkmrx163.github.io/MineCraft_Qantum/');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Exclusively Dedicated to MineCraft_Qantum */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/90 border border-cyan-800/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Строгая привязка только к вашей игре
              </span>
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                15 Веб-Слотов
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white">Выделенный Сервер для MineCraft_Qantum</h2>

            <div className="flex items-center gap-2 text-xs font-mono-tabular">
              <span className="text-slate-400">Ссылка на подключенную игру:</span>
              <a
                href="https://darkmrx163.github.io/MineCraft_Qantum/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 underline hover:text-cyan-300 font-bold flex items-center gap-1"
              >
                <span>https://darkmrx163.github.io/MineCraft_Qantum/</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={copyGameUrl}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                title="Скопировать ссылку на игру"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowWhitelistModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-cyan-400" />
              <span>Добавить в Вайтлист</span>
            </button>

            <button
              onClick={onOpenGitHubExport}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl transition-all shadow-md shadow-cyan-950/40 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Скрипт для Игры</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Memory */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2 font-medium">
              <HardDrive className="w-4 h-4 text-cyan-400" /> Выделено ОЗУ
            </span>
            <span className="font-mono-tabular font-bold text-slate-200">{memPercent}%</span>
          </div>
          <div className="text-lg font-bold text-white font-mono-tabular">
            {status.memoryUsedMB} <span className="text-xs font-normal text-slate-500">/ 8192 MB</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${memPercent}%` }} />
          </div>
        </div>

        {/* CPU */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2 font-medium">
              <Cpu className="w-4 h-4 text-blue-400" /> Загрузка ЦП
            </span>
            <span className="font-mono-tabular font-bold text-slate-200">{status.cpuPercent}%</span>
          </div>
          <div className="text-lg font-bold text-white font-mono-tabular">
            {status.cpuPercent}% <span className="text-xs font-normal text-slate-500">(16 ядер)</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${status.cpuPercent * 2}%` }} />
          </div>
        </div>

        {/* TPS */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2 font-medium">
              <Activity className="w-4 h-4 text-emerald-400" /> Скорость Тика (TPS)
            </span>
            <span className="font-mono-tabular font-bold text-emerald-400">100%</span>
          </div>
          <div className="text-lg font-bold text-white font-mono-tabular flex items-baseline gap-1.5">
            <span>20.00</span>
            <span className="text-xs font-normal text-slate-500">/ 20.00 TPS</span>
          </div>
          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-purple-400" /> Время работы
            </span>
            <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded">WebSocket Active</span>
          </div>
          <div className="text-lg font-bold text-white font-mono-tabular">
            {formatUptime(status.uptimeSeconds)}
          </div>
          <p className="text-[11px] text-slate-500">Подключено веб-клиентов: {status.activeWebClientsCount}</p>
        </div>
      </div>

      {/* 15 Player Slot Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Панель 15 Игроков MineCraft_Qantum</span>
            </h3>
            <p className="text-xs text-slate-400">
              Игроки, подключенные из вашей браузерной игры <code className="text-cyan-300">https://darkmrx163.github.io/MineCraft_Qantum/</code>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-tabular">
            <span className="text-slate-400">Онлайн:</span>
            <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60">
              {status.onlinePlayersCount} / 15
            </span>
          </div>
        </div>

        {/* Grid of 15 slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {slots.map((slot) => (
            <PlayerCard
              key={slot.slotNumber}
              slot={slot}
              onPlayerAction={(slotNum, action, reason) =>
                onPlayerAction(slotNum, action, undefined, reason)
              }
              onAddWhitelistModal={() => setShowWhitelistModal(true)}
            />
          ))}
        </div>
      </div>

      {/* Whitelist Modal */}
      {showWhitelistModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Добавить игрока в Вайтлист MineCraft Qantum</h3>
            <input
              type="text"
              placeholder="Никнейм игрока"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-tabular"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowWhitelistModal(false)} className="px-4 py-2 text-xs text-slate-400">
                Отмена
              </button>
              <button
                onClick={() => {
                  if (newUsername.trim()) {
                    onPlayerAction(1, 'add_whitelist', newUsername.trim());
                    setNewUsername('');
                    setShowWhitelistModal(false);
                  }
                }}
                className="px-5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
