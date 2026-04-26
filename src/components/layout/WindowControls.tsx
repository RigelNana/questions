import { useState, useEffect } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';

interface ElectronAPI {
  isElectron: boolean;
  platform: string;
  minimize: () => void;
  maximize: () => void;
  close: () => void;
  isMaximized: () => Promise<boolean>;
  onMaximizedChange: (cb: (v: boolean) => void) => () => void;
}

function getElectronAPI(): ElectronAPI | null {
  if ('electronAPI' in window) return (window as unknown as { electronAPI: ElectronAPI }).electronAPI;
  return null;
}

export function WindowControls() {
  const api = getElectronAPI();
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!api) return;
    api.isMaximized().then(setMaximized);
    return api.onMaximizedChange(setMaximized);
  }, [api]);

  if (!api || api.platform === 'darwin') return null;

  const btnBase =
    'inline-flex items-center justify-center w-[46px] h-full transition-colors duration-150 [-webkit-app-region:no-drag]';

  return (
    <div className="flex items-center h-full ml-auto shrink-0 -mr-4 sm:-mr-5 [-webkit-app-region:no-drag]">
      <button
        onClick={() => api.minimize()}
        className={`${btnBase} hover:bg-[var(--color-notion-bg-hover)]`}
        aria-label="Minimize"
      >
        <Minus className="w-4 h-4 text-[var(--color-notion-text-secondary)]" />
      </button>
      <button
        onClick={() => api.maximize()}
        className={`${btnBase} hover:bg-[var(--color-notion-bg-hover)]`}
        aria-label={maximized ? 'Restore' : 'Maximize'}
      >
        {maximized
          ? <Copy className="w-3.5 h-3.5 text-[var(--color-notion-text-secondary)] rotate-180" />
          : <Square className="w-3 h-3 text-[var(--color-notion-text-secondary)]" />
        }
      </button>
      <button
        onClick={() => api.close()}
        className={`${btnBase} hover:bg-[var(--color-notion-error)] hover:text-white group`}
        aria-label="Close"
      >
        <X className="w-4 h-4 text-[var(--color-notion-text-secondary)] group-hover:text-white" />
      </button>
    </div>
  );
}

export function isElectronEnv(): boolean {
  return 'electronAPI' in window;
}
