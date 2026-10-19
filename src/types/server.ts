export type ServerState = 'running' | 'stopped' | 'restarting' | 'starting';

export interface ServerStatus {
  state: ServerState;
  uptimeSeconds: number;
  cpuPercent: number;
  memoryUsedMB: number;
  memoryMaxMB: number;
  tps: number; // e.g. 19.98
  onlinePlayersCount: number;
  maxPlayers: number; // 15
  ipAddress: string;
  port: number; // 25565
  worldName: string;
  gameVersion: string;
  motdFormatted: string;
  targetGameTitle: string; // 'CraftCraft 3D — Мультиплеерный мир блоков'
  targetGameUrl: string; // 'https://darkmrx163.github.io/MineCraft_Qantum/'
  strictOriginLock: boolean;
  activeWebClientsCount: number;
  autoDeployStatus: 'idle' | 'in_progress' | 'deployed_success';
}

export interface PlayerSlot {
  slotNumber: number; // 1 to 15
  isConnected: boolean;
  username?: string;
  ping?: number;
  joinedAt?: string;
  gamemode?: 'survival' | 'creative' | 'spectator' | 'adventure';
  isOp?: boolean;
  isWhitelisted?: boolean;
  isBanned?: boolean;
  coords?: string;
  health?: number;
  inventorySummary?: string[];
  clientOrigin?: string; // 'https://darkmrx163.github.io'
  connectionType?: 'web_craftcraft' | 'desktop_native';
  verifiedQuantumClient?: boolean;
}

export interface ServerConfig {
  general: {
    serverName: string;
    motd: string;
    maxPlayers: number; // locked to 15 default
    serverPort: number;
    whiteList: boolean;
    onlineMode: boolean; // premium vs cracked
    allowFlight: boolean;
    pvp: boolean;
    targetGameTitle: string;
    targetGameUrl: string; // 'https://darkmrx163.github.io/MineCraft_Qantum/'
    strictOriginLock: boolean;
  };
  gameplay: {
    difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
    gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
    hardcore: boolean;
    spawnProtection: number;
    enableCommandBlocks: boolean;
    spawnMonsters: boolean;
    spawnAnimals: boolean;
  };
  performance: {
    viewDistance: number; // 2-32 (rec 10 for 15 slots)
    simulationDistance: number; // 2-16 (rec 6)
    entityBroadcastRangePercent: number;
    maxTickTimeMs: number;
    autoSaveIntervalMinutes: number;
    networkCompressionThreshold: number;
  };
  rcon: {
    rconEnabled: boolean;
    rconPort: number;
    rconPassword: string;
  };
}

export interface ModItem {
  id: string;
  name: string;
  filename: string;
  version: string;
  category: 'optimization' | 'gameplay' | 'world' | 'tech' | 'ui';
  sizeMB: number;
  enabled: boolean;
  priority: number;
  description: string;
  dependencies?: string[];
  configSnippet?: string;
  author?: string;
  webQuantumCompatible?: boolean;
}

export interface BackupSchedule {
  enabled: boolean;
  intervalHours: number; // 1, 3, 6, 12, 24
  retentionCount: number; // keep last N
  includeWorld: boolean;
  includeMods: boolean;
  includeConfigs: boolean;
  lastBackupTimestamp?: string;
  nextBackupTimestamp?: string;
}

export interface BackupItem {
  id: string;
  timestamp: string;
  label: string;
  type: 'scheduled' | 'manual' | 'pre_update';
  sizeMB: number;
  worldName: string;
  modCount: number;
  playerCount: number;
}

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CHAT';
  source: string;
  message: string;
}

export interface RepoFile {
  path: string;
  content: string;
  description: string;
  category: 'docker' | 'config' | 'scripts' | 'mods' | 'readme' | 'github' | 'client_quantum';
}

export interface ModConflictAnalysis {
  hasConflicts: boolean;
  summary: string;
  conflicts: Array<{
    mod1: string;
    mod2: string;
    reason: string;
    severity: 'critical' | 'warning';
    recommendation: string;
  }>;
  optimizationTips: string[];
}
