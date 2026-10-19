import React from 'react';
import { LayoutDashboard, Sliders, Puzzle, Database, Terminal, Github, Gamepad2, Sparkles } from 'lucide-react';

export type TabType = 'overview' | 'game' | 'config' | 'mods' | 'backups' | 'console' | 'github';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  modCount: number;
  backupCount: number;
  onlinePlayerCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  modCount,
  backupCount,
  onlinePlayerCount,
}) => {
  const navItems = [
    {
      id: 'overview' as TabType,
      label: 'Обзор & 15 Слотов',
      icon: LayoutDashboard,
      badge: `${onlinePlayerCount}/15`,
    },
    {
      id: 'game' as TabType,
      label: 'Играть в MineCraft_Qantum',
      icon: Gamepad2,
      badge: 'LIVE',
      highlight: true,
    },
    {
      id: 'config' as TabType,
      label: 'Конфигуратор',
      icon: Sliders,
    },
    {
      id: 'mods' as TabType,
      label: 'Моды & Плагины',
      icon: Puzzle,
      badge: `${modCount} модов`,
    },
    {
      id: 'backups' as TabType,
      label: 'Авто-Бэкапы',
      icon: Database,
      badge: `${backupCount}`,
    },
    {
      id: 'console' as TabType,
      label: 'Живая Консоль',
      icon: Terminal,
    },
    {
      id: 'github' as TabType,
      label: 'GitHub & Внедрение',
      icon: Github,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Navigation Category */}
        <div>
          <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase mb-3 px-3">
            Панель Игры & Сервера
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md shadow-cyan-950/40'
                        : 'bg-slate-800 text-cyan-400 border border-slate-700/60 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono-tabular px-2 py-0.5 rounded ${
                        isActive
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bound Game Info Box */}
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-cyan-800/60 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-200 font-bold">
            <span>Привязанная Игра</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800/50 font-mono-tabular">
              Online
            </span>
          </div>
          <p className="text-[11px] text-cyan-400 truncate font-mono-tabular">
            darkmrx163.github.io/MineCraft_Qantum/
          </p>
          <div className="space-y-1 text-[11px] text-slate-400 font-mono-tabular pt-1 border-t border-slate-800/80">
            <div className="flex justify-between">
              <span>Слоты:</span>
              <span className="text-white font-semibold">15 мест</span>
            </div>
            <div className="flex justify-between">
              <span>WebSocket:</span>
              <span className="text-emerald-400 font-semibold">/ws Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
        <div className="flex items-center justify-between">
          <span>MineCraft_Qantum Engine</span>
          <span className="font-mono-tabular">v2.4.0</span>
        </div>
        <p className="text-[10px] text-slate-600">Авто-внедрение в GitHub Pages</p>
      </div>
    </aside>
  );
};
