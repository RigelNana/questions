export function isElectronEnv(): boolean {
  return 'electronAPI' in window;
}
