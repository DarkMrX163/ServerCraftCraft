import React, { useState } from 'react';
import { UserCheck, Shield, ShieldAlert, UserX, UserMinus, Eye, Wifi, Compass, Heart } from 'lucide-react';
import type { PlayerSlot } from '../../types/server.ts';

interface PlayerCardProps {
  slot: PlayerSlot;
  onPlayerAction: (slotNumber: number, action: 'kick' | 'ban' | 'toggle_op', reason?: string) => void;
  onAddWhitelistModal: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  slot,
  onPlayerAction,
  onAddWhitelistModal,
}) => {
  const [showInventory, setShowInventory] = useState(false);
  const [showKickModal, setShowKickModal] = useState(false);
  const [kickReason, setKickReason] = useState('');

  if (!slot.isConnected) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700 transition-all group">
        <div className="flex items-center justify-between text-xs text-slate-500 font-mono-tabular">
          <span className="font-bold text-slate-600">Слот #{slot.slotNumber} из 15</span>
          <span className="text-[10px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-600">Свободен</span>
        </div>

        <div className="my-3 text-center py-2">
          {slot.username ? (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 font-mono-tabular">{slot.username}</span>
              <div className="text-[10px] text-amber-500/80">Зарезервирован (Вайтлист)</div>
            </div>
          ) : (
            <div className="text-xs text-slate-600">Пустой слот подключения</div>
          )}
        </div>

        <button
          onClick={onAddWhitelistModal}
          className="w-full py-1.5 text-[11px] font-medium text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 border border-dashed border-slate-800 hover:border-cyan-800 rounded-lg transition-colors cursor-pointer"
        >
          + Добавить в вайтлист
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-slate-700/80 transition-all shadow-sm">
      {/* Top Bar: Slot # & Ping */}
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono-tabular font-bold text-slate-500 text-[11px]">#{slot.slotNumber}</span>
          <span className="font-bold text-white text-xs tracking-wide">{slot.username}</span>
          {slot.isOp && (
            <span className="bg-amber-950 text-amber-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-amber-800/50 flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" /> OP
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono-tabular">
          <Wifi className="w-3 h-3" />
          <span>{slot.ping} мс</span>
        </div>
      </div>

      {/* Stats & Coords */}
      <div className="space-y-1.5 my-2 text-[11px] text-slate-400">
        <div className="flex items-center justify-between bg-slate-950/60 p-1.5 rounded border border-slate-800 font-mono-tabular">
          <div className="flex items-center gap-1 text-slate-400">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Координаты:</span>
          </div>
          <span className="text-slate-200 font-medium">{slot.coords || 'X: 0, Y: 64, Z: 0'}</span>
        </div>

        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-500">Время в игре: {slot.joinedAt}</span>
          <span className="text-slate-400 uppercase font-bold">{slot.gamemode}</span>
        </div>
      </div>

      {/* Inventory Preview Toggle */}
      {showInventory && slot.inventorySummary && (
        <div className="mb-2 p-2 bg-slate-950 rounded-lg border border-slate-800 text-[10px] space-y-1">
          <div className="font-bold text-cyan-400 text-[10px]">Инвентарь игрока:</div>
          <div className="flex flex-wrap gap-1">
            {slot.inventorySummary.map((item, idx) => (
              <span key={idx} className="bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded border border-slate-800">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-800/60">
        <button
          onClick={() => setShowInventory(!showInventory)}
          className="flex-1 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <Eye className="w-3 h-3" />
          <span>{showInventory ? 'Скрыть' : 'Инвентарь'}</span>
        </button>

        <button
          onClick={() => onPlayerAction(slot.slotNumber, 'toggle_op')}
          title={slot.isOp ? 'Снять OP права' : 'Выдать OP права'}
          className={`p-1.5 rounded transition-colors cursor-pointer ${
            slot.isOp ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowKickModal(true)}
          title="Кикнуть игрока"
          className="p-1.5 bg-slate-800 hover:bg-amber-950 text-slate-400 hover:text-amber-300 rounded transition-colors cursor-pointer"
        >
          <UserMinus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onPlayerAction(slot.slotNumber, 'ban')}
          title="Забанить игрока"
          className="p-1.5 bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded transition-colors cursor-pointer"
        >
          <UserX className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Kick Reason Prompt Modal */}
      {showKickModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-sm w-full space-y-4">
            <h4 className="text-sm font-bold text-white">Кикнуть игрока {slot.username}?</h4>
            <p className="text-xs text-slate-400">Укажите причину для показа игроку на экране отключения:</p>
            <input
              type="text"
              placeholder="Причина (например: Переподключение для обновления модов)"
              value={kickReason}
              onChange={(e) => setKickReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowKickModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  onPlayerAction(slot.slotNumber, 'kick', kickReason);
                  setShowKickModal(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white rounded-lg"
              >
                Кикнуть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
