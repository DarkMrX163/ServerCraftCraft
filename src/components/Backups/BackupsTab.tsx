import React, { useState } from 'react';
import { Database, Clock, Download, RotateCcw, Plus, ShieldCheck, Trash2, Check, RefreshCw, FileText } from 'lucide-react';
import type { BackupSchedule, BackupItem } from '../../types/server.ts';

interface BackupsTabProps {
  schedule: BackupSchedule;
  backups: BackupItem[];
  onUpdateSchedule: (schedule: Partial<BackupSchedule>) => Promise<void>;
  onCreateBackup: (label: string) => Promise<void>;
  onRestoreBackup: (id: string) => Promise<void>;
  onDeleteBackup: (id: string) => Promise<void>;
}

export const BackupsTab: React.FC<BackupsTabProps> = ({
  schedule,
  backups,
  onUpdateSchedule,
  onCreateBackup,
  onRestoreBackup,
  onDeleteBackup,
}) => {
  const [showManualModal, setShowManualModal] = useState(false);
  const [backupLabel, setBackupLabel] = useState('');
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    try {
      await onRestoreBackup(id);
      setRestoreMessage('Данные сервера успешно восстановлены!');
      setTimeout(() => setRestoreMessage(null), 3000);
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>Автоматическое Резервное Копирование Данных</span>
          </h2>
          <p className="text-xs text-slate-400">
            Защита мира, инвентарей 15 игроков и настроек модов по расписанию и в 1 клик
          </p>
        </div>

        <button
          onClick={() => setShowManualModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl transition-all shadow-md shadow-cyan-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Создать Моментальный Снимок</span>
        </button>
      </div>

      {/* Restore Alert */}
      {restoreMessage && (
        <div className="bg-emerald-950/90 border border-emerald-800 text-emerald-200 p-4 rounded-xl text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 font-bold">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{restoreMessage}</span>
          </div>
          <button onClick={() => setRestoreMessage(null)} className="text-xs text-emerald-400">
            ✕
          </button>
        </div>
      )}

      {/* Automated Scheduler Settings Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Настройка Таймера Авто-Бэкапов</span>
          </h3>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-bold text-slate-300">
              {schedule.enabled ? 'Авто-бэкапы ВКЛ' : 'Авто-бэкапы ВЫКЛ'}
            </span>
            <input
              type="checkbox"
              checked={schedule.enabled}
              onChange={(e) => onUpdateSchedule({ enabled: e.target.checked })}
              className="w-4 h-4 accent-cyan-500"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Interval */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Интервал создания копий</label>
            <select
              value={schedule.intervalHours}
              onChange={(e) => onUpdateSchedule({ intervalHours: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value={1}>Каждый 1 час</option>
              <option value={3}>Каждые 3 часа (Рекомендуется)</option>
              <option value={6}>Каждые 6 часов</option>
              <option value={12}>Каждые 12 часов</option>
              <option value={24}>Ежедневно раз в сутки</option>
            </select>
          </div>

          {/* Retention limit */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Хранить старых бэкапов (Retention)</label>
            <select
              value={schedule.retentionCount}
              onChange={(e) => onUpdateSchedule({ retentionCount: parseInt(e.target.value) })}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            >
              <option value={3}>3 последних снимка</option>
              <option value={5}>5 последних снимков</option>
              <option value={10}>10 последних снимков</option>
              <option value={20}>20 последних снимков</option>
            </select>
          </div>

          {/* Timestamps status */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1 text-xs font-mono-tabular">
            <div className="text-slate-400">
              Последний авто-бэкап:{' '}
              <span className="text-slate-200 font-bold">{schedule.lastBackupTimestamp || 'Ещё не создавался'}</span>
            </div>
            <div className="text-slate-400">
              Следующий бэкап:{' '}
              <span className="text-cyan-400 font-bold">{schedule.nextBackupTimestamp || 'Через 1 ч. 00 мин.'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white">История Точек Восстановления ({backups.length})</h3>
          <span className="text-xs text-slate-400">Формат сжатия: TAR.GZ / ZIP</span>
        </div>

        <div className="space-y-3">
          {backups.map((bkp) => (
            <div
              key={bkp.id}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono-tabular font-bold text-cyan-400 text-xs">[{bkp.id}]</span>
                  <span className="text-xs font-bold text-white">{bkp.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.2 rounded font-semibold ${
                      bkp.type === 'scheduled'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                        : bkp.type === 'manual'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                    }`}
                  >
                    {bkp.type === 'scheduled' ? 'Автоматический' : bkp.type === 'manual' ? 'Ручной' : 'Точка обновления'}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono-tabular">
                  <span>Время: {bkp.timestamp}</span>
                  <span>Размер: {bkp.sizeMB} MB</span>
                  <span>Мир: {bkp.worldName}</span>
                  <span>Модов: {bkp.modCount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleRestore(bkp.id)}
                  disabled={restoringId === bkp.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {restoringId === bkp.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span>Восстановить</span>
                </button>

                <a
                  href="/api/github/export-zip"
                  download
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  title="Скачать архив бэкапа на компьютер"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onDeleteBackup(bkp.id)}
                  className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Удалить данный снимок"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Snapshot Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Создание Ручной Точки Восстановления</h3>

            <p className="text-xs text-slate-400">
              Мгновенно сохраняет полный архив карт, данных 15 игроков, конфигураций и модов.
            </p>

            <input
              type="text"
              placeholder="Комментарий (например: Перед битвой с Драконом)"
              value={backupLabel}
              onChange={(e) => setBackupLabel(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowManualModal(false)} className="px-4 py-2 text-xs text-slate-400">
                Отмена
              </button>
              <button
                onClick={() => {
                  onCreateBackup(backupLabel || 'Ручной снимок администратора');
                  setBackupLabel('');
                  setShowManualModal(false);
                }}
                className="px-5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl"
              >
                Создать Бэкап
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
