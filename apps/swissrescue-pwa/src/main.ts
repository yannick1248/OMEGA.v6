import { saveRecord } from './db';

async function bootstrap(): Promise<void> {
  const status = document.getElementById('status');
  if (!status) return;

  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('/sw.js');
  }

  await saveRecord({ id: 'boot', payload: { ok: true, offline: true }, ts: Date.now() });
  status.textContent = 'offline cache + indexeddb: OK';
}

void bootstrap();
