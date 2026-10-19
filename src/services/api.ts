import type {
  ServerStatus,
  PlayerSlot,
  ServerConfig,
  ModItem,
  BackupSchedule,
  BackupItem,
  ConsoleLogEntry,
  RepoFile,
  ModConflictAnalysis,
} from '../types/server.ts';

export const api = {
  // Status & Telemetry
  async getStatus(): Promise<ServerStatus> {
    const res = await fetch('/api/status');
    return res.json();
  },

  async triggerStatusAction(action: 'start' | 'stop' | 'restart'): Promise<{ success: boolean; status: ServerStatus }> {
    const res = await fetch('/api/status/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    return res.json();
  },

  // Player Management (15 slots)
  async getPlayers(): Promise<{ slots: PlayerSlot[]; onlineCount: number; maxSlots: number }> {
    const res = await fetch('/api/players');
    return res.json();
  },

  async playerAction(params: {
    slotNumber?: number;
    action: 'kick' | 'ban' | 'toggle_op' | 'add_whitelist';
    username?: string;
    reason?: string;
  }): Promise<{ success: boolean; slots: PlayerSlot[] }> {
    const res = await fetch('/api/players/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Configuration
  async getConfig(): Promise<ServerConfig> {
    const res = await fetch('/api/config');
    return res.json();
  },

  async updateConfig(config: ServerConfig): Promise<{ success: boolean; config: ServerConfig }> {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return res.json();
  },

  // Mods & AI Compatibility
  async getMods(): Promise<ModItem[]> {
    const res = await fetch('/api/mods');
    return res.json();
  },

  async toggleMod(modId: string): Promise<{ success: boolean; mods: ModItem[] }> {
    const res = await fetch('/api/mods/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modId }),
    });
    return res.json();
  },

  async addMod(modData: Partial<ModItem>): Promise<{ success: boolean; mods: ModItem[] }> {
    const res = await fetch('/api/mods/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modData),
    });
    return res.json();
  },

  async deleteMod(modId: string): Promise<{ success: boolean; mods: ModItem[] }> {
    const res = await fetch(`/api/mods/${modId}`, { method: 'DELETE' });
    return res.json();
  },

  async analyzeMods(): Promise<ModConflictAnalysis> {
    const res = await fetch('/api/mods/analyze', { method: 'POST' });
    return res.json();
  },

  // Backups
  async getBackups(): Promise<{ schedule: BackupSchedule; backups: BackupItem[] }> {
    const res = await fetch('/api/backups');
    return res.json();
  },

  async updateBackupSchedule(schedule: Partial<BackupSchedule>): Promise<{ success: boolean; schedule: BackupSchedule }> {
    const res = await fetch('/api/backups/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    });
    return res.json();
  },

  async createBackup(label: string): Promise<{ success: boolean; backup: BackupItem; backups: BackupItem[] }> {
    const res = await fetch('/api/backups/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label }),
    });
    return res.json();
  },

  async restoreBackup(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch('/api/backups/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return res.json();
  },

  async deleteBackup(id: string): Promise<{ success: boolean; backups: BackupItem[] }> {
    const res = await fetch(`/api/backups/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Console
  async getConsoleLogs(): Promise<ConsoleLogEntry[]> {
    const res = await fetch('/api/console');
    return res.json();
  },

  async sendConsoleCommand(command: string): Promise<{ success: boolean; logs: ConsoleLogEntry[] }> {
    const res = await fetch('/api/console/command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
    return res.json();
  },

  async analyzeConsoleLogs(): Promise<{ text: string }> {
    const res = await fetch('/api/console/analyze-logs', { method: 'POST' });
    return res.json();
  },

  // GitHub Export
  async getRepoFiles(): Promise<RepoFile[]> {
    const res = await fetch('/api/github/files');
    return res.json();
  },

  getZipExportUrl(): string {
    return '/api/github/export-zip';
  },

  // AI Server Assistant
  async askAIAssistant(prompt: string): Promise<{ text: string }> {
    const res = await fetch('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    return res.json();
  },
};
