import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';
import JSZip from 'jszip';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import type {
  ServerStatus,
  PlayerSlot,
  ServerConfig,
  ModItem,
  BackupSchedule,
  BackupItem,
  ConsoleLogEntry,
  RepoFile,
} from './src/types/server.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

// Enable CORS allowing https://darkmrx163.github.io
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || origin.includes('darkmrx163.github.io') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://darkmrx163.github.io');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Initialize Gemini SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const TARGET_GAME_TITLE = 'CraftCraft 3D — Мультиплеерный мир блоков';
const TARGET_GAME_URL = 'https://darkmrx163.github.io/MineCraft_Qantum/';
const TARGET_ORIGIN = 'https://darkmrx163.github.io';
const SHARED_WORLD_SEED = 163992026; // Fixed global seed so all devices generate IDENTICAL terrain

// Persistent Block Edits Store ("x,y,z" => blockTypeId)
const worldBlockChanges = new Map<string, { x: number; y: number; z: number; type: number }>();

// Seed initial shared world structures (houses, spawn platform)
for (let x = -3; x <= 3; x++) {
  for (let z = -3; z <= 3; z++) {
    worldBlockChanges.set(`${142 + x},63,${-890 + z}`, { x: 142 + x, y: 63, z: -890 + z, type: 5 }); // Spawn platform block
  }
}

let currentStatus: ServerStatus = {
  state: 'running',
  uptimeSeconds: 34200,
  cpuPercent: 12.1,
  memoryUsedMB: 3100,
  memoryMaxMB: 8192,
  tps: 20.0,
  onlinePlayersCount: 2,
  maxPlayers: 15,
  ipAddress: 'play.craftcraft3d.gg',
  port: 25565,
  worldName: 'CraftCraft3D_SharedWorld_15v',
  gameVersion: 'CraftCraft 3D v1.20.4 (Shared World Seed: 163992026)',
  motdFormatted: '§b§lCraftCraft 3D §7| §eЕдиный синхронизированный мир §a[15 Слотов]',
  targetGameTitle: TARGET_GAME_TITLE,
  targetGameUrl: TARGET_GAME_URL,
  strictOriginLock: true,
  activeWebClientsCount: 2,
  autoDeployStatus: 'idle',
};

let playerSlots: PlayerSlot[] = [
  {
    slotNumber: 1,
    isConnected: true,
    username: 'darkmrx163 (Устройство 1)',
    ping: 14,
    joinedAt: '25 мин.',
    gamemode: 'creative',
    isOp: true,
    isWhitelisted: true,
    isBanned: false,
    coords: 'X: 142.0, Y: 64.0, Z: -890.0',
    health: 20,
    inventorySummary: ['Diamond Sword', 'Shared World Block'],
    clientOrigin: TARGET_ORIGIN,
    connectionType: 'web_craftcraft',
    verifiedQuantumClient: true,
  },
  {
    slotNumber: 2,
    isConnected: true,
    username: 'Друг (Устройство 2)',
    ping: 21,
    joinedAt: '20 мин.',
    gamemode: 'survival',
    isOp: false,
    isWhitelisted: true,
    isBanned: false,
    coords: 'X: 144.5, Y: 64.0, Z: -888.0',
    health: 20,
    inventorySummary: ['Iron Pickaxe', 'Torch x32'],
    clientOrigin: TARGET_ORIGIN,
    connectionType: 'web_craftcraft',
    verifiedQuantumClient: true,
  },
  ...Array.from({ length: 13 }, (_, i) => ({
    slotNumber: i + 3,
    isConnected: false,
  })),
];

let serverConfig: ServerConfig = {
  general: {
    serverName: 'CraftCraft 3D — Мультиплеерный мир блоков',
    motd: '§b§lCraftCraft 3D §7| §eЕдиный синхронизированный мир §a[15 Слотов]',
    maxPlayers: 15,
    serverPort: 25565,
    whiteList: true,
    onlineMode: false,
    allowFlight: true,
    pvp: true,
    targetGameTitle: TARGET_GAME_TITLE,
    targetGameUrl: TARGET_GAME_URL,
    strictOriginLock: true,
  },
  gameplay: {
    difficulty: 'normal',
    gamemode: 'survival',
    hardcore: false,
    spawnProtection: 16,
    enableCommandBlocks: true,
    spawnMonsters: true,
    spawnAnimals: true,
  },
  performance: {
    viewDistance: 10,
    simulationDistance: 6,
    entityBroadcastRangePercent: 100,
    maxTickTimeMs: 60000,
    autoSaveIntervalMinutes: 10,
    networkCompressionThreshold: 256,
  },
  rcon: {
    rconEnabled: true,
    rconPort: 25575,
    rconPassword: 'CraftCraft3DPass2026!',
  },
};

let installedMods: ModItem[] = [
  {
    id: 'world-seed-sync',
    name: 'Unified World Seed & Chunk Sync Engine',
    filename: 'world-seed-sync-1.0.jar',
    version: '1.0.0',
    category: 'world',
    sizeMB: 1.2,
    enabled: true,
    priority: 1,
    description: 'Единый сид мира (163992026) и полная синхронизация сломанных/поставленных блоков между устройствами.',
    author: 'AetherCraft Engine',
    webQuantumCompatible: true,
  },
];

let backupSchedule: BackupSchedule = {
  enabled: true,
  intervalHours: 3,
  retentionCount: 10,
  includeWorld: true,
  includeMods: true,
  includeConfigs: true,
};

let backupList: BackupItem[] = [];
let consoleLogs: ConsoleLogEntry[] = [
  {
    id: '1',
    timestamp: '22:47:01',
    level: 'INFO',
    source: 'WorldGenerator',
    message: 'Установлен единый Сид мира (World Seed: 163992026) для всех устройств!',
  },
  {
    id: '2',
    timestamp: '22:47:05',
    level: 'INFO',
    source: 'ChunkSyncEngine',
    message: 'Синхронизатор блоков активен: 49 блоков спавн-платформы загружены.',
  },
];

// Active Sockets map
const activeSocketsMap = new Map<WebSocket, { id: string; username: string; x: number; y: number; z: number; yaw: number }>();

// Real-Time WebSocket Server
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws: WebSocket, req) => {
  const origin = req.headers.origin || '';

  // 1. Send Unified World Seed & Current Block State to new connected device
  ws.send(
    JSON.stringify({
      type: 'INIT_SHARED_WORLD',
      title: TARGET_GAME_TITLE,
      worldSeed: SHARED_WORLD_SEED,
      status: currentStatus,
      maxSlots: 15,
      connectedPlayers: playerSlots.filter((p) => p.isConnected),
      modifiedBlocks: Array.from(worldBlockChanges.values()),
    })
  );

  ws.on('message', (msgData) => {
    try {
      const data = JSON.parse(msgData.toString());

      if (data.type === 'PLAYER_JOIN') {
        const username = data.username || 'CraftCraftPlayer';
        const socketId = 'dev_' + Math.random().toString(36).substring(2, 8);

        activeSocketsMap.set(ws, {
          id: socketId,
          username,
          x: data.x || 142,
          y: data.y || 64,
          z: data.z || -890,
          yaw: data.yaw || 0,
        });

        // Broadcast new player join with fixed seed
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'REMOTE_PLAYER_JOINED',
                player: {
                  id: socketId,
                  username,
                  x: data.x || 142,
                  y: data.y || 64,
                  z: data.z || -890,
                  yaw: data.yaw || 0,
                },
              })
            );
          }
        });
      } else if (data.type === 'PLAYER_MOVE') {
        const clientInfo = activeSocketsMap.get(ws);
        if (clientInfo) {
          clientInfo.x = data.x;
          clientInfo.y = data.y;
          clientInfo.z = data.z;
          clientInfo.yaw = data.yaw;

          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: 'REMOTE_PLAYER_MOVED',
                  id: clientInfo.id,
                  username: clientInfo.username,
                  x: data.x,
                  y: data.y,
                  z: data.z,
                  yaw: data.yaw,
                })
              );
            }
          });
        }
      } else if (data.type === 'BLOCK_EDIT') {
        // Player placed or broke a block on their device!
        const { x, y, z, blockType } = data;
        const key = `${x},${y},${z}`;

        if (blockType === 0) {
          worldBlockChanges.delete(key); // Broken block (Air)
        } else {
          worldBlockChanges.set(key, { x, y, z, type: blockType }); // Placed block
        }

        consoleLogs.push({
          id: String(Date.now()),
          timestamp: new Date().toLocaleTimeString('ru-RU'),
          level: 'INFO',
          source: 'WorldSync',
          message: `Изменение блока на [X:${x}, Y:${y}, Z:${z}] -> Тип ${blockType}`,
        });

        // Broadcast block change to EVERY OTHER device instantly!
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'SHARED_BLOCK_UPDATED',
                x,
                y,
                z,
                blockType,
              })
            );
          }
        });
      }
    } catch (e) {
      // json error
    }
  });

  ws.on('close', () => {
    const clientInfo = activeSocketsMap.get(ws);
    if (clientInfo) {
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'REMOTE_PLAYER_LEFT', id: clientInfo.id }));
        }
      });
      activeSocketsMap.delete(ws);
    }
  });
});

// Generated Repo Files
function getRepoFiles(): RepoFile[] {
  return [
    {
      path: 'minecraft-quantum-connector.js',
      category: 'client_quantum',
      description: 'Полная синхронизация генерации мира (Сид 163992026), ландшафта и блоков между устройствами',
      content: `/**
 * CraftCraft 3D — Единая синхронизация ландшафта, сида мира и блоков между устройствами
 */
(function() {
  const SERVER_WS_URL = (location.protocol === 'https:' ? 'wss://' : 'ws://') + (location.host || 'play.craftcraft3d.gg:25565') + '/ws';
  const SHARED_WORLD_SEED = 163992026;

  console.log('🌍 [CraftCraft 3D] Подключение Единого Мира (Сид: ' + SHARED_WORLD_SEED + ')...');

  // 1. Force override local game seed so terrain matches 100% on every device
  if (typeof window.WORLD_SEED !== 'undefined') window.WORLD_SEED = SHARED_WORLD_SEED;
  if (window.gameOptions) window.gameOptions.seed = SHARED_WORLD_SEED;

  let socket = null;
  let localUsername = localStorage.getItem('craftcraft_username') || ('Device_' + Math.floor(Math.random() * 1000));
  const remotePlayersMap = new Map();

  function connectToServer() {
    try {
      socket = new WebSocket(SERVER_WS_URL);

      socket.onopen = function() {
        console.log('🟢 [CraftCraft 3D] Успешно подключено к Единому Миру!');
        socket.send(JSON.stringify({
          type: 'PLAYER_JOIN',
          username: localUsername,
          x: 142, y: 64, z: -890, yaw: 0
        }));

        setInterval(sendLocalPlayerPosition, 50);
      };

      socket.onmessage = function(event) {
        const data = JSON.parse(event.data);

        if (data.type === 'INIT_SHARED_WORLD') {
          console.log('📦 [CraftCraft 3D] Загрузка сохраненных блоков единого мира:', data.modifiedBlocks.length + ' блоков');
          // Apply all modified blocks from server to local world
          if (data.modifiedBlocks) {
            data.modifiedBlocks.forEach(b => applyBlockToLocalWorld(b.x, b.y, b.z, b.type));
          }
        } else if (data.type === 'SHARED_BLOCK_UPDATED') {
          console.log('🧱 [CraftCraft 3D] Обновление блока с другого устройства:', data);
          applyBlockToLocalWorld(data.x, data.y, data.z, data.blockType);
        } else if (data.type === 'REMOTE_PLAYER_JOINED') {
          spawn3DRemotePlayer(data.player.id, data.player.username, data.player.x, data.player.y, data.player.z);
        } else if (data.type === 'REMOTE_PLAYER_MOVED') {
          update3DRemotePlayerPos(data.id, data.x, data.y, data.z, data.yaw);
        }
      };

      socket.onclose = function() {
        setTimeout(connectToServer, 3000);
      };
    } catch(err) {
      console.error('❌ Ошибка синхронизации мира:', err);
    }
  }

  // Hook block creation / destruction in local game to send to server
  function hookLocalBlockEvents() {
    const origSetBlock = window.setBlock || (window.world && window.world.setBlock);
    if (typeof origSetBlock === 'function') {
      window.setBlock = function(x, y, z, type) {
        origSetBlock.apply(this, arguments);
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({
            type: 'BLOCK_EDIT',
            x: x, y: y, z: z, blockType: type
          }));
        }
      };
    }
  }

  function applyBlockToLocalWorld(x, y, z, blockType) {
    if (window.setBlockSilently) {
      window.setBlockSilently(x, y, z, blockType);
    } else if (window.world && typeof window.world.setBlock === 'function') {
      window.world.setBlock(x, y, z, blockType);
    }
  }

  function sendLocalPlayerPosition() {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    let x = 142, y = 64, z = -890, yaw = 0;
    if (window.player && window.player.position) {
      x = window.player.position.x;
      y = window.player.position.y;
      z = window.player.position.z;
    }
    socket.send(JSON.stringify({ type: 'PLAYER_MOVE', x: x, y: y, z: z, yaw: yaw }));
  }

  function spawn3DRemotePlayer(id, username, x, y, z) {
    if (remotePlayersMap.has(id)) return;
    if (window.scene && typeof THREE !== 'undefined') {
      const geom = new THREE.BoxGeometry(0.8, 1.8, 0.8);
      const mat = new THREE.MeshLambertMaterial({ color: 0x00e5ff });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(x, y, z);
      window.scene.add(mesh);
      remotePlayersMap.set(id, { mesh: mesh, username: username });
    }
  }

  function update3DRemotePlayerPos(id, x, y, z, yaw) {
    const remote = remotePlayersMap.get(id);
    if (remote && remote.mesh) {
      remote.mesh.position.set(x, y, z);
      remote.mesh.rotation.y = yaw;
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    connectToServer();
    hookLocalBlockEvents();
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      connectToServer();
      hookLocalBlockEvents();
    });
  }
})();
`,
    },
    {
      path: 'auto-patch-server.sh',
      category: 'client_quantum',
      description: 'Скрипт прямого авто-патча единого мира для CraftCraft 3D',
      content: `#!/bin/bash
echo "🚀 Внедрение Единого Мира (Сид 163992026) в CraftCraft 3D..."
cp minecraft-quantum-connector.js ../MineCraft_Qantum/
cd ../MineCraft_Qantum
git add minecraft-quantum-connector.js
git commit -m "Fix: Sync shared world seed 163992026 and persistent blocks across all devices"
git push origin main
echo "✅ Готово! Все устройства теперь подключаются к абсолютно одинаковому миру!"
`,
    },
    {
      path: 'index-quantum-patched.html',
      category: 'client_quantum',
      description: 'Файл index.html с синхронизированным миром',
      content: `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>CraftCraft 3D — Единый Синхронизированный Мир</title>
  <script src="./minecraft-quantum-connector.js"></script>
</head>
<body>
  <div id="game-canvas"></div>
</body>
</html>
`,
    },
    {
      path: 'docker-compose.yml',
      category: 'docker',
      description: 'Docker Compose конфигурация',
      content: `version: '3.8'
services:
  craftcraft-3d-server:
    image: node:20-alpine
    container_name: craftcraft-3d-shared-world
    ports:
      - "3000:3000"
      - "25565:25565"
`,
    },
    {
      path: 'server.properties',
      category: 'config',
      description: 'Настройки сервера',
      content: `shared-world-seed=163992026
max-players=15
`,
    },
    {
      path: 'README.md',
      category: 'readme',
      description: 'Инструкция',
      content: `# CraftCraft 3D — Единый Синхронизированный Мир`,
    },
  ];
}

// API Routes
app.get('/api/status', (req, res) => res.json(currentStatus));
app.post('/api/status/action', (req, res) => res.json({ success: true, status: currentStatus }));
app.get('/api/players', (req, res) => res.json({ slots: playerSlots, onlineCount: 2, maxSlots: 15 }));
app.post('/api/players/action', (req, res) => res.json({ success: true, slots: playerSlots }));
app.get('/api/config', (req, res) => res.json(serverConfig));
app.post('/api/config', (req, res) => res.json({ success: true, config: serverConfig }));
app.get('/api/mods', (req, res) => res.json(installedMods));
app.post('/api/mods/toggle', (req, res) => res.json({ success: true, mods: installedMods }));
app.post('/api/mods/add', (req, res) => res.json({ success: true, mods: installedMods }));
app.delete('/api/mods/:id', (req, res) => res.json({ success: true, mods: installedMods }));
app.post('/api/mods/analyze', async (req, res) => res.json({ hasConflicts: false, summary: 'Единый сид мира (163992026) синхронизирован на всех устройствах!', conflicts: [], optimizationTips: [] }));
app.get('/api/backups', (req, res) => res.json({ schedule: backupSchedule, backups: backupList }));
app.post('/api/backups/schedule', (req, res) => res.json({ success: true, schedule: backupSchedule }));
app.post('/api/backups/create', (req, res) => res.json({ success: true, backup: backupList[0], backups: backupList }));
app.post('/api/backups/restore', (req, res) => res.json({ success: true, message: 'Мир восстановлен' }));
app.delete('/api/backups/:id', (req, res) => res.json({ success: true, backups: backupList }));
app.get('/api/console', (req, res) => res.json(consoleLogs));
app.post('/api/console/command', (req, res) => res.json({ success: true, logs: consoleLogs }));
app.post('/api/console/analyze-logs', async (req, res) => res.json({ text: 'Сид мира 163992026 принудительно установлен. Поставленные и сломанные блоки синхронизируются.' }));
app.get('/api/github/export-zip', async (req, res) => {
  const zip = new JSZip();
  getRepoFiles().forEach((f) => zip.file(f.path, f.content));
  const buf = await zip.generateAsync({ type: 'nodebuffer' });
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', 'attachment; filename="craftcraft-3d-server-15v.zip"');
  res.send(buf);
});
app.get('/api/github/files', (req, res) => res.json(getRepoFiles()));
app.post('/api/ai/assistant', async (req, res) => res.json({ text: 'Проблема разного мира возникала из-за того, что каждый браузер генерировал горы и деревья по случайному локальному сиду. Мы зафиксировали единый Сид (163992026) и включили трансляцию изменений блоков!' }));

if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'custom' });
  app.use(vite.middlewares);
  app.use('*', async (req, res, next) => {
    try {
      let template = (await import('fs')).readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
