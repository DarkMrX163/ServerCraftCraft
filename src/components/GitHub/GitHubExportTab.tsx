import React, { useState } from 'react';
import { Github, Download, Copy, Check, FileCode, Folder, ExternalLink, Gamepad2, ShieldCheck, Play, Sparkles } from 'lucide-react';
import type { RepoFile } from '../../types/server.ts';

interface GitHubExportTabProps {
  files: RepoFile[];
  zipExportUrl: string;
}

export const GitHubExportTab: React.FC<GitHubExportTabProps> = ({ files, zipExportUrl }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('minecraft-quantum-connector.js');
  const [copiedGit, setCopiedGit] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);

  const connectorFile = files.find((f) => f.path === 'minecraft-quantum-connector.js') || files[0];
  const selectedFile = files.find((f) => f.path === selectedFilePath) || connectorFile;

  const gitCommandsText = `git init
git add .
git commit -m "Add MineCraft_Qantum server connector & auto-backups"
git branch -M main
git remote add origin https://github.com/darkmrx163/MineCraft_Qantum_Server.git
git push -u origin main`;

  const handleCopyGitCommands = () => {
    navigator.clipboard.writeText(gitCommandsText);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  const handleCopyConnectorScript = () => {
    if (connectorFile) {
      navigator.clipboard.writeText(connectorFile.content);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    }
  };

  const handleCopyFileContent = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopiedFile(true);
      setTimeout(() => setCopiedFile(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner specifically for MineCraft_Qantum */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-cyan-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Привязано только к https://darkmrx163.github.io/MineCraft_Qantum/
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Подключение сервера к игре MineCraft_Qantum
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Вставьте скрипт <code className="text-cyan-300 font-bold font-mono-tabular">minecraft-quantum-connector.js</code> в репозиторий вашей игры на GitHub, чтобы включить онлайн мультиплеер на 15 человек.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleCopyConnectorScript}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedScript ? 'Скрипт Скопирован!' : 'Скопировать Скрипт Игры'}</span>
            </button>

            <a
              href={zipExportUrl}
              download
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl transition-all shadow-lg shadow-cyan-950/50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Скачать Весь Проект ZIP</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3 Steps Guide for darkmrx163 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
            <span>ШАГ 1</span>
            <FileCode className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Вставка скрипта в репозиторий</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Скопируйте <code className="text-cyan-300">minecraft-quantum-connector.js</code> в репозиторий{' '}
            <code className="text-slate-200">darkmrx163/MineCraft_Qantum</code>.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
            <span>ШАГ 2</span>
            <Github className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Подключение в index.html</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            В файле <code className="text-slate-200">index.html</code> игры добавьте строку:{' '}
            <code className="text-cyan-300 font-mono-tabular">&lt;script src="./minecraft-quantum-connector.js"&gt;&lt;/script&gt;</code>
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>ШАГ 3</span>
            <Gamepad2 className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Запуск Мультиплеера</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Сделайте <code className="text-emerald-300">git push</code>. Теперь до 15 человек смогут заходить в игру по ссылке{' '}
            <a href="https://darkmrx163.github.io/MineCraft_Qantum/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">
              MineCraft_Qantum
            </a>!
          </p>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Folder className="w-4 h-4 text-cyan-400" />
            <span>Файлы подключения и сервера ({files.length} шт)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono-tabular">darkmrx163.github.io/MineCraft_Qantum/</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* File Tree */}
          <div className="space-y-1">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFilePath(file.path)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono-tabular transition-colors cursor-pointer text-left ${
                  selectedFilePath === file.path
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <FileCode className="w-4 h-4 shrink-0" />
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>

          {/* File Viewer */}
          <div className="md:col-span-3 space-y-2">
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-t-xl border border-slate-800">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white font-mono-tabular">{selectedFile?.path}</span>
                <p className="text-[11px] text-slate-400">{selectedFile?.description}</p>
              </div>

              <button
                onClick={handleCopyFileContent}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                {copiedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Копировать код</span>
              </button>
            </div>

            <textarea
              readOnly
              value={selectedFile?.content || ''}
              rows={16}
              className="w-full p-4 bg-slate-950 font-mono-tabular text-xs text-cyan-300 border border-slate-800 rounded-b-xl focus:outline-none leading-relaxed select-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
