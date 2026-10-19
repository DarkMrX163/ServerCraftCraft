import React, { useState } from 'react';
import { Puzzle, Sparkles, Upload, ToggleLeft, ToggleRight, Trash2, ShieldCheck, Download, AlertTriangle, Search, Check, Layers } from 'lucide-react';
import type { ModItem, ModConflictAnalysis } from '../../types/server.ts';

interface ModsTabProps {
  mods: ModItem[];
  onToggleMod: (modId: string) => Promise<void>;
  onAddMod: (modData: Partial<ModItem>) => Promise<void>;
  onDeleteMod: (modId: string) => Promise<void>;
  onAnalyzeMods: () => Promise<ModConflictAnalysis>;
}

export const ModsTab: React.FC<ModsTabProps> = ({
  mods,
  onToggleMod,
  onAddMod,
  onDeleteMod,
  onAnalyzeMods,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ModConflictAnalysis | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [newModName, setNewModName] = useState('');
  const [newModFilename, setNewModFilename] = useState('');
  const [newModCategory, setNewModCategory] = useState<'optimization' | 'gameplay' | 'world' | 'tech' | 'ui'>('gameplay');

  const storePresets = [
    {
      name: 'Sodium / Rubidium Renderer',
      filename: 'sodium-fabric-0.5.8.jar',
      version: '0.5.8',
      category: 'optimization' as const,
      sizeMB: 3.2,
      description: 'Кардинально повышает FPS на клиенте и разгружает чанки сервера.',
    },
    {
      name: 'Alex\'s Mobs & World Creatures',
      filename: 'alexsmobs-1.22.8.jar',
      version: '1.22.8',
      category: 'world' as const,
      sizeMB: 12.4,
      description: 'Добавляет 85+ новых существ и редких мобов в игровой мир.',
    },
    {
      name: 'Sophisticated Backpacks',
      filename: 'sophisticatedbackpacks-1.20.4.jar',
      version: '3.19.2',
      category: 'gameplay' as const,
      sizeMB: 2.8,
      description: 'Улучшенные рюкзаки с улучшениями авто-сортировки.',
    },
  ];

  const filteredMods = mods.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleRunAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await onAnalyzeMods();
      setAnalysisResult(res);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-cyan-400" />
            <span>Менеджер Модов и Поддержка Модификаций</span>
          </h2>
          <p className="text-xs text-slate-400">
            Управляйте модами Fabric/Forge, оптимизируйте память для 15 человек и проверяйте совместимость через AI
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAiAnalysis}
            disabled={analyzing}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>{analyzing ? 'Анализ...' : 'AI Проверка Конфликтов'}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Загрузить .JAR Мод</span>
          </button>
        </div>
      </div>

      {/* AI Analysis Result Callout */}
      {analysisResult && (
        <div className="bg-slate-950 border border-cyan-800/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
              <Sparkles className="w-4 h-4" />
              <span>Отчет Gemini AI о совместимости модов для 15 человек</span>
            </div>
            <button onClick={() => setAnalysisResult(null)} className="text-xs text-slate-500 hover:text-white">
              Закрыть
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">{analysisResult.summary}</p>

          {analysisResult.optimizationTips && analysisResult.optimizationTips.length > 0 && (
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-[11px] font-bold text-emerald-400">Советы по оптимизации 15 слотов:</div>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                {analysisResult.optimizationTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Поиск мода по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs">
          {['all', 'optimization', 'gameplay', 'tech', 'world', 'ui'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Все моды' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Installed Mods List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-slate-800 pb-2">
          <span>Установленные модификации ({filteredMods.length})</span>
          <span>Приоритет & Статус</span>
        </div>

        <div className="space-y-2">
          {filteredMods.map((mod) => (
            <div
              key={mod.id}
              className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                mod.enabled
                  ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/30 border-slate-900/80 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-xs">
                  #{mod.priority}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{mod.name}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono-tabular">
                      v{mod.version}
                    </span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded capitalize border border-cyan-800/40">
                      {mod.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{mod.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono-tabular mt-1">
                    Файл: <code className="text-slate-400">{mod.filename}</code> · Размер: {mod.sizeMB} MB
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onToggleMod(mod.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    mod.enabled
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {mod.enabled ? (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-400" />
                      <span>Активен</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4 text-slate-500" />
                      <span>Отключен</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onDeleteMod(mod.id)}
                  title="Удалить мод"
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 1-Click Popular Presets */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Быстрая установка популярных модов для 15 человек</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {storePresets.map((preset, idx) => (
            <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{preset.name}</span>
                <span className="text-[10px] bg-slate-900 text-cyan-400 px-1.5 py-0.5 rounded font-mono-tabular">
                  {preset.sizeMB} MB
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{preset.description}</p>
              <button
                onClick={() =>
                  onAddMod({
                    name: preset.name,
                    filename: preset.filename,
                    version: preset.version,
                    category: preset.category,
                    sizeMB: preset.sizeMB,
                    description: preset.description,
                  })
                }
                className="w-full py-1.5 text-xs font-semibold bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 rounded-lg transition-colors border border-slate-700/60 cursor-pointer"
              >
                + Установить в 1 клик
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Mod Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-sm font-bold text-white">Загрузка Пользовательского Мода (.jar)</h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300">Название Мода</label>
                <input
                  type="text"
                  placeholder="например: Botania Magic"
                  value={newModName}
                  onChange={(e) => setNewModName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Имя файла .jar</label>
                <input
                  type="text"
                  placeholder="Botania-1.20.4-440.jar"
                  value={newModFilename}
                  onChange={(e) => setNewModFilename(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono-tabular focus:outline-none focus:border-cyan-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Категория</label>
                <select
                  value={newModCategory}
                  onChange={(e) => setNewModCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white mt-1"
                >
                  <option value="optimization">Оптимизация (Optimization)</option>
                  <option value="gameplay">Геймплей (Gameplay)</option>
                  <option value="tech">Техника (Tech)</option>
                  <option value="world">Мир & Мобы (World)</option>
                  <option value="ui">Интерфейс & Чат (UI)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs text-slate-400">
                Отмена
              </button>
              <button
                onClick={() => {
                  if (newModName && newModFilename) {
                    onAddMod({
                      name: newModName,
                      filename: newModFilename,
                      category: newModCategory,
                      version: '1.0.0',
                      description: 'Пользовательская модификация для 15 человек',
                    });
                    setNewModName('');
                    setNewModFilename('');
                    setShowAddModal(false);
                  }
                }}
                className="px-5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl"
              >
                Загрузить и Активировать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
