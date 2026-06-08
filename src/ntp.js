import Sntp from '@hapi/sntp';
import { config } from './config.js';

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const requestOffset = async (host) => {
  const res = await Sntp.time({
    host,
    port: config.ntp.port,
    timeout: config.ntp.timeout,
  });

  return res.t;
};

const createNtpSync = () => {
  let offsetMs = 0;
  let lastSyncedAt = null;
  let lastHost = null;
  let timerId = null;

  const syncOnce = async () => {
    let lastError = null;

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
        console.warn(`[ntp] ${host}: ${err.message}`);
      }
    }

    console.error(
      '[ntp] все серверы недоступны:',
      lastError?.message ?? 'unknown error',
    );

    return false;
  };

  const sync = async () => {
    await syncOnce();
  };

  const start = async () => {
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

  const stop = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const getAccurateTimeMs = () => Date.now() + offsetMs;

  const getStatus = () => ({
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
