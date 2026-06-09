import Sntp from '@hapi/sntp';
import { config } from './config.js';

type NtpStatus = {
  offsetMs: number;
  lastSyncedAt: number | null;
  lastHost: string | null;
  synced: boolean;
};

type NtpSync = {
  getAccurateTimeMs: () => number;
  getStatus: () => NtpStatus;
  start: () => Promise<void>;
  stop: () => void;
  sync: () => Promise<void>;
};

const wait = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'unknown error';

const requestOffset = async (host: string): Promise<number> => {
  const res = await Sntp.time({
    host,
    port: config.ntp.port,
    timeout: config.ntp.timeout,
  });

  return res.t;
};

const createNtpSync = (): NtpSync => {
  let offsetMs = 0;
  let lastSyncedAt: number | null = null;
  let lastHost: string | null = null;
  let timerId: ReturnType<typeof setInterval> | null = null;

  const syncOnce = async (): Promise<boolean> => {
    let lastError: unknown = null;

    for (const host of config.ntp.hosts) {
      try {
        offsetMs = await requestOffset(host);
        lastSyncedAt = Date.now();
        lastHost = host;
        console.log(
          `[ntp] синхронизирован через ${host}, смещение ${offsetMs} мс`,
        );

        return true;
      } catch (err) {
        lastError = err;
        console.warn(`[ntp] ${host}: ${getErrorMessage(err)}`);
      }
    }

    console.error('[ntp] все серверы недоступны:', getErrorMessage(lastError));

    return false;
  };

  const sync = async (): Promise<void> => {
    await syncOnce();
  };

  const start = async (): Promise<void> => {
    for (let attempt = 1; attempt <= config.ntp.startupAttempts; attempt += 1) {
      const synced = await syncOnce();

      if (synced) {
        break;
      }

      if (attempt < config.ntp.startupAttempts) {
        await wait(1000 * attempt);
      }
    }

    timerId = setInterval(sync, config.ntp.syncIntervalMs);
  };

  const stop = (): void => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const getAccurateTimeMs = (): number => Date.now() + offsetMs;

  const getStatus = (): NtpStatus => ({
    offsetMs,
    lastSyncedAt,
    lastHost,
    synced: lastSyncedAt !== null,
  });

  return {
    getAccurateTimeMs,
    getStatus,
    start,
    stop,
    sync,
  };
};

export { createNtpSync };
export type { NtpSync, NtpStatus };
