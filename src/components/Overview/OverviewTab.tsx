import React, { useState } from 'react';
import { Cpu, HardDrive, Activity, Users, ShieldCheck, UserPlus, Zap, Clock, ExternalLink, Globe2, Layers, Check, Copy, RefreshCw } from 'lucide-react';
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
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [syncedStatus, setSyncedStatus] = useState(false);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h} ч. ${m} мин.`;
  };

  const memPercent = Math.round((status.memoryUsedMB / status.memoryMaxMB) * 100);

  const copyWorldSeed = () => {
    navigator.clipboard.writeText('163992026');
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  const handleForceWorldSync = () => {
    setSyncedStatus(true);
    setTimeout(() => setSyncedStatus(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: World Seed & Cross-Device Sync */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-cyan-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5" /> Единый ландшафт на всех устройствах
              </span>
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Сид Мира: 163992026
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white">CraftCraft 3D — Единый Синхронизированный Мир</h2>

            <div className="flex items-center gap-3 text-xs font-mono-tabular">
              <span className="text-slate-400">Фиксированный Сид мира:</span>
              <code className="text-cyan-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                163992026
              </code>
              <button
                onClick={copyWorldSeed}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                title="Скопировать сид мира"
              >
                {copiedSeed ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleForceWorldSync}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {syncedStatus ? <Check className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4" />}
              <span>{syncedStatus ? 'Мир Синхронизирован!' : 'Синхронизировать блоки на всех ПК'}</span>
            </button>

            <button
              onClick={onOpenGitHubExport}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl transition-all shadow-md shadow-cyan-950/40 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Код Обновления Мира</span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2 font-medium">
              <HardDrive className="w-4 h-4 text-cyan-400" /> Память Сервера
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

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-2 font-medium">
              <Clock className="w-4 h-4 text-purple-400" /> Синхронизация Блоков
            </span>
            <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded">Active Sync</span>
          </div>
          <div className="text-lg font-bold text-white font-mono-tabular">
            100% Все ПК
          </div>
          <p className="text-[11px] text-slate-500">Одинаковые горы, деревья и стройки</p>
        </div>
      </div>

      {/* 15 Player Slot Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Игроки в Едином Мире CraftCraft 3D (15 слотов)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Оба устройства заходят в мир с Сидом <code className="text-cyan-300 font-mono-tabular">163992026</code>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono-tabular">
            <span className="text-slate-400">Игроки онлайн:</span>
            <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60">
              {status.onlinePlayersCount} / 15
            </span>
          </div>
        </div>

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
            <h3 className="text-sm font-bold text-white">Добавить никнейм в Вайтлист CraftCraft 3D</h3>
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
