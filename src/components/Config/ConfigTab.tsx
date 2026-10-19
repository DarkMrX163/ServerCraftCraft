import React, { useState } from 'react';
import { Sliders, Save, RefreshCw, FileCode, Eye, Shield, Check, Globe, Gamepad2, Zap, Key } from 'lucide-react';
import type { ServerConfig } from '../../types/server.ts';

interface ConfigTabProps {
  config: ServerConfig;
  onSaveConfig: (updatedConfig: ServerConfig) => Promise<void>;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({ config, onSaveConfig }) => {
  const [formData, setFormData] = useState<ServerConfig>(JSON.parse(JSON.stringify(config)));
  const [activeCategory, setActiveCategory] = useState<'general' | 'gameplay' | 'performance' | 'rcon' | 'raw'>('general');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [rawCode, setRawCode] = useState(() => formatRawProperties(config));

  function formatRawProperties(cfg: ServerConfig): string {
    return `# AetherCraft 15-Slot Modded Game Server
server-name=${cfg.general.serverName}
motd=${cfg.general.motd}
max-players=${cfg.general.maxPlayers}
server-port=${cfg.general.serverPort}
white-list=${cfg.general.whiteList}
online-mode=${cfg.general.onlineMode}
allow-flight=${cfg.general.allowFlight}
pvp=${cfg.general.pvp}
difficulty=${cfg.gameplay.difficulty}
gamemode=${cfg.gameplay.gamemode}
hardcore=${cfg.gameplay.hardcore}
spawn-protection=${cfg.gameplay.spawnProtection}
enable-command-block=${cfg.gameplay.enableCommandBlocks}
spawn-monsters=${cfg.gameplay.spawnMonsters}
spawn-animals=${cfg.gameplay.spawnAnimals}
view-distance=${cfg.performance.viewDistance}
simulation-distance=${cfg.performance.simulationDistance}
entity-broadcast-range-percentage=${cfg.performance.entityBroadcastRangePercent}
max-tick-time=${cfg.performance.maxTickTimeMs}
network-compression-threshold=${cfg.performance.networkCompressionThreshold}
enable-rcon=${cfg.rcon.rconEnabled}
rcon.port=${cfg.rcon.rconPort}
rcon.password=${cfg.rcon.rconPassword}
`;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSaveConfig(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Живая Панель Настройки Конфигурации</span>
          </h2>
          <p className="text-xs text-slate-400">
            Изменяйте параметры игрового сервера на 15 мест в режиме реального времени без перезапуска
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-xl transition-all shadow-md shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : savedSuccess ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saving ? 'Применение...' : savedSuccess ? 'Применено!' : 'Сохранить и Применить Live'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
        {[
          { id: 'general', label: 'Основные & Слоты', icon: Globe },
          { id: 'gameplay', label: 'Геймплей & Режим', icon: Gamepad2 },
          { id: 'performance', label: 'Производительность', icon: Zap },
          { id: 'rcon', label: 'RCON & Сеть', icon: Key },
          { id: 'raw', label: 'Код server.properties', icon: FileCode },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        {/* Category 1: General & Slots */}
        {activeCategory === 'general' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Основные настройки сервера</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Server Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Название сервера</label>
                <input
                  type="text"
                  value={formData.general.serverName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, serverName: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* MOTD */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Описание в списке серверов (MOTD)</label>
                <input
                  type="text"
                  value={formData.general.motd}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, motd: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-cyan-300 font-mono-tabular focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Max Players (15 Limit) */}
              <div className="space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">Максимум слотов игроков</label>
                  <span className="font-bold text-cyan-400 font-mono-tabular">{formData.general.maxPlayers} мест</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={formData.general.maxPlayers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, maxPlayers: parseInt(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-500">Пресет оптимизирован строго на 15 одновременных участников.</p>
              </div>

              {/* Server Port */}
              <div className="space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <label className="text-xs font-semibold text-slate-300">Основной Порт Сервера</label>
                <input
                  type="number"
                  value={formData.general.serverPort}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, serverPort: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono-tabular"
                />
              </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Вайтлист (White-List)</div>
                  <div className="text-[10px] text-slate-500">Вход только по списку</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.general.whiteList}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, whiteList: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Пиратский доступ</div>
                  <div className="text-[10px] text-slate-500">Вход без лицензии</div>
                </div>
                <input
                  type="checkbox"
                  checked={!formData.general.onlineMode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, onlineMode: !e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">Полет при модах</div>
                  <div className="text-[10px] text-slate-500">Джетпаки и ранцы</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.general.allowFlight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, allowFlight: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <div>
                  <div className="text-xs font-bold text-white">PVP Бои</div>
                  <div className="text-[10px] text-slate-500">Урон между игроками</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.general.pvp}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, pvp: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-cyan-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* Category 2: Gameplay */}
        {activeCategory === 'gameplay' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Геймплей и правила игрового мира</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Сложность игры</label>
                <select
                  value={formData.gameplay.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gameplay: { ...formData.gameplay, difficulty: e.target.value as any },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="peaceful">Мирная (Peaceful)</option>
                  <option value="easy">Легкая (Easy)</option>
                  <option value="normal">Обычная (Normal)</option>
                  <option value="hard">Сложная (Hard)</option>
                </select>
              </div>

              {/* Gamemode */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Основной режим игры</label>
                <select
                  value={formData.gameplay.gamemode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gameplay: { ...formData.gameplay, gamemode: e.target.value as any },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                >
                  <option value="survival">Выживание (Survival)</option>
                  <option value="creative">Творческий (Creative)</option>
                  <option value="adventure">Приключение (Adventure)</option>
                  <option value="spectator">Наблюдатель (Spectator)</option>
                </select>
              </div>

              {/* Spawn Protection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Радиус защиты спавна (в блоках)</label>
                <input
                  type="number"
                  value={formData.gameplay.spawnProtection}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gameplay: { ...formData.gameplay, spawnProtection: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono-tabular"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-xs font-bold text-white">Командные блоки</span>
                <input
                  type="checkbox"
                  checked={formData.gameplay.enableCommandBlocks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gameplay: { ...formData.gameplay, enableCommandBlocks: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-xs font-bold text-white">Спавн монстров</span>
                <input
                  type="checkbox"
                  checked={formData.gameplay.spawnMonsters}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gameplay: { ...formData.gameplay, spawnMonsters: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer">
                <span className="text-xs font-bold text-white">Спавн животных</span>
                <input
                  type="checkbox"
                  checked={formData.gameplay.spawnAnimals}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gameplay: { ...formData.gameplay, spawnAnimals: e.target.checked },
                    })
                  }
                  className="w-4 h-4 accent-cyan-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* Category 3: Performance */}
        {activeCategory === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Оптимизация под 15 человек и 8ГБ ОЗУ</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* View Distance */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">Дальность прорисовки (View Distance)</label>
                  <span className="font-bold text-cyan-400 font-mono-tabular">{formData.performance.viewDistance} чанков</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={24}
                  value={formData.performance.viewDistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      performance: { ...formData.performance, viewDistance: parseInt(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-emerald-400">
                  ✓ Значение 10 является идеальным стандартом для 15 игроков без падения TPS.
                </p>
              </div>

              {/* Simulation Distance */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs">
                  <label className="font-semibold text-slate-300">Дистанция симуляции тиков</label>
                  <span className="font-bold text-cyan-400 font-mono-tabular">{formData.performance.simulationDistance} чанков</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={formData.performance.simulationDistance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      performance: { ...formData.performance, simulationDistance: parseInt(e.target.value) },
                    })
                  }
                  className="w-full accent-cyan-500"
                />
                <p className="text-[11px] text-slate-500">Управляет расчетами механизмов мода Create вне видимости.</p>
              </div>
            </div>
          </div>
        )}

        {/* Category 4: RCON */}
        {activeCategory === 'rcon' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">Удаленная консоль (RCON Protocol)</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">RCON Порт</label>
                <input
                  type="number"
                  value={formData.rcon.rconPort}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rcon: { ...formData.rcon, rconPort: parseInt(e.target.value) },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono-tabular"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">RCON Пароль</label>
                <input
                  type="text"
                  value={formData.rcon.rconPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rcon: { ...formData.rcon, rconPassword: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-amber-300 font-mono-tabular"
                />
              </div>
            </div>
          </div>
        )}

        {/* Category 5: Raw Code Editor */}
        {activeCategory === 'raw' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Прямой редактор server.properties</h3>
              <span className="text-[11px] font-mono-tabular text-slate-400">Формат UTF-8</span>
            </div>

            <textarea
              value={rawCode}
              onChange={(e) => setRawCode(e.target.value)}
              rows={16}
              className="w-full p-4 bg-slate-950 font-mono-tabular text-xs text-cyan-300 border border-slate-800 rounded-xl focus:outline-none focus:border-cyan-500 leading-relaxed"
            />
          </div>
        )}
      </div>
    </div>
  );
};
