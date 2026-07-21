const API_KEY = 'sre-quiz-agent-api-key';
const PROXY_TOKEN = 'sre-quiz-agent-proxy-token';

function readSecret(key: string): string {
  try {
    return sessionStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

function writeSecret(key: string, value: string): void {
  try {
    if (value) sessionStorage.setItem(key, value);
    else sessionStorage.removeItem(key);
  } catch {
    // Secrets remain unavailable when session storage is blocked.
  }
}

export const agentSecrets = {
  getApiKey: () => readSecret(API_KEY),
  setApiKey: (value: string) => writeSecret(API_KEY, value.trim()),
  getProxyToken: () => readSecret(PROXY_TOKEN),
  setProxyToken: (value: string) => writeSecret(PROXY_TOKEN, value.trim()),
  clear: () => {
    writeSecret(API_KEY, '');
    writeSecret(PROXY_TOKEN, '');
  },
};
