/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar, TabType } from './components/Sidebar.tsx';
import { OverviewTab } from './components/Overview/OverviewTab.tsx';
import { GamePreviewTab } from './components/Game/GamePreviewTab.tsx';
import { ConfigTab } from './components/Config/ConfigTab.tsx';
import { ModsTab } from './components/Mods/ModsTab.tsx';
import { BackupsTab } from './components/Backups/BackupsTab.tsx';
import { ConsoleTab } from './components/Console/ConsoleTab.tsx';
import { GitHubExportTab } from './components/GitHub/GitHubExportTab.tsx';
import { AIAssistantModal } from './components/AIAssistant/AIAssistantModal.tsx';
import { api } from './services/api.ts';
import type {
  ServerStatus,
  PlayerSlot,
  ServerConfig,
  ModItem,
  BackupSchedule,
  BackupItem,
  ConsoleLogEntry,
  RepoFile,
} from './types/server.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Core Data States
  const [status, setStatus] = useState<ServerStatus>({
    state: 'running',
    uptimeSeconds: 28410,
    cpuPercent: 11.4,
    memoryUsedMB: 2980,
    memoryMaxMB: 8192,
    tps: 20.0,
    onlinePlayersCount: 7,
    maxPlayers: 15,
    ipAddress: 'play.craftcraft3d.gg',
    port: 25565,
    worldName: 'CraftCraft3D_World_15v',
    gameVersion: 'CraftCraft 3D v1.20.4',
    motdFormatted: '§b§lCraftCraft 3D §7| §eМультиплеерный мир блоков §a[15 Слотов]',
    targetGameTitle: 'CraftCraft 3D — Мультиплеерный мир блоков',
    targetGameUrl: 'https://darkmrx163.github.io/MineCraft_Qantum/',
    strictOriginLock: true,
    activeWebClientsCount: 7,
    autoDeployStatus: 'idle',
  });

  const [slots, setSlots] = useState<PlayerSlot[]>([]);
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [mods, setMods] = useState<ModItem[]>([]);
  const [backupSchedule, setBackupSchedule] = useState<BackupSchedule>({
    enabled: true,
    intervalHours: 3,
    retentionCount: 10,
    includeWorld: true,
    includeMods: true,
    includeConfigs: true,
  });
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogEntry[]>([]);
  const [repoFiles, setRepoFiles] = useState<RepoFile[]>([]);

  // Initial Load
  useEffect(() => {
    async function loadData() {
      try {
        const [st, pl, cfg, md, bkp, csl, rf] = await Promise.all([
          api.getStatus(),
          api.getPlayers(),
          api.getConfig(),
          api.getMods(),
          api.getBackups(),
          api.getConsoleLogs(),
          api.getRepoFiles(),
        ]);

        setStatus(st);
        setSlots(pl.slots);
        setConfig(cfg);
        setMods(md);
        setBackupSchedule(bkp.schedule);
        setBackups(bkp.backups);
        setConsoleLogs(csl);
        setRepoFiles(rf);
      } catch (err) {
        console.error('Failed loading server data:', err);
      }
    }

    loadData();
  }, []);

  // Poll server status telemetry every 3s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const st = await api.getStatus();
        setStatus(st);
      } catch (e) {
        // ignore background poll error
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleServerAction = async (action: 'start' | 'stop' | 'restart') => {
    const res = await api.triggerStatusAction(action);
    setStatus(res.status);
    const pl = await api.getPlayers();
    setSlots(pl.slots);
  };

  const handlePlayerAction = async (
    slotNum?: number,
    action?: 'kick' | 'ban' | 'toggle_op' | 'add_whitelist',
    username?: string,
    reason?: string
  ) => {
    if (!action) return;
    const res = await api.playerAction({ slotNumber: slotNum, action, username, reason });
    setSlots(res.slots);
    const st = await api.getStatus();
    setStatus(st);
  };

  const handleSaveConfig = async (updatedConfig: ServerConfig) => {
    const res = await api.updateConfig(updatedConfig);
    setConfig(res.config);
    const rf = await api.getRepoFiles();
    setRepoFiles(rf);
  };

  const handleToggleMod = async (modId: string) => {
    const res = await api.toggleMod(modId);
    setMods(res.mods);
  };

  const handleAddMod = async (modData: Partial<ModItem>) => {
    const res = await api.addMod(modData);
    setMods(res.mods);
  };

  const handleDeleteMod = async (modId: string) => {
    const res = await api.deleteMod(modId);
    setMods(res.mods);
  };

  const handleUpdateSchedule = async (sched: Partial<BackupSchedule>) => {
    const res = await api.updateBackupSchedule(sched);
    setBackupSchedule(res.schedule);
  };

  const handleCreateBackup = async (label: string) => {
    const res = await api.createBackup(label);
    setBackups(res.backups);
  };

  const handleRestoreBackup = async (id: string) => {
    await api.restoreBackup(id);
  };

  const handleDeleteBackup = async (id: string) => {
    const res = await api.deleteBackup(id);
    setBackups(res.backups);
  };

  const handleSendConsoleCommand = async (cmd: string) => {
    const res = await api.sendConsoleCommand(cmd);
    setConsoleLogs(res.logs);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navbar */}
      <Navbar
        status={status}
        onAction={handleServerAction}
        onOpenGitHubExport={() => setActiveTab('github')}
        onOpenAIAssistant={() => setIsAiModalOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          modCount={mods.filter((m) => m.enabled).length}
          backupCount={backups.length}
          onlinePlayerCount={status.onlinePlayersCount}
        />

        {/* Viewport Content */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewTab
              status={status}
              slots={slots}
              onPlayerAction={handlePlayerAction as any}
              onOpenGitHubExport={() => setActiveTab('github')}
            />
          )}

          {activeTab === 'game' && (
            <GamePreviewTab
              status={status}
              onOpenGitHubExport={() => setActiveTab('github')}
            />
          )}

          {activeTab === 'config' && config && (
            <ConfigTab config={config} onSaveConfig={handleSaveConfig} />
          )}

          {activeTab === 'mods' && (
            <ModsTab
              mods={mods}
              onToggleMod={handleToggleMod}
              onAddMod={handleAddMod}
              onDeleteMod={handleDeleteMod}
              onAnalyzeMods={api.analyzeMods}
            />
          )}

          {activeTab === 'backups' && (
            <BackupsTab
              schedule={backupSchedule}
              backups={backups}
              onUpdateSchedule={handleUpdateSchedule}
              onCreateBackup={handleCreateBackup}
              onRestoreBackup={handleRestoreBackup}
              onDeleteBackup={handleDeleteBackup}
            />
          )}

          {activeTab === 'console' && (
            <ConsoleTab
              logs={consoleLogs}
              onSendCommand={handleSendConsoleCommand}
              onAnalyzeLogs={api.analyzeConsoleLogs}
            />
          )}

          {activeTab === 'github' && (
            <GitHubExportTab files={repoFiles} zipExportUrl={api.getZipExportUrl()} />
          )}
        </main>
      </div>

      {/* Gemini AI Assistant Floating Modal */}
      <AIAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onAskAI={api.askAIAssistant}
      />
    </div>
  );
}
