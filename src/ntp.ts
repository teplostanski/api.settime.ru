import Sntp from 'nano-sntp';

type NtpConfig = {
  hosts: string[];
  port: number;
  timeout: number;
  syncIntervalMs: number;
  startupAttempts: number;
};

const startNtp = async (ntp: NtpConfig): Promise<void> => {
  await Sntp.start({
    hosts: ntp.hosts,
    port: ntp.port,
    timeout: ntp.timeout,
    clockSyncRefresh: ntp.syncIntervalMs,
    startupAttempts: ntp.startupAttempts,
    onError: (err) => {
      const message = err instanceof Error ? err.message : 'unknown error';
      console.warn(`[ntp] ${message}`);
    },
    onSync: (result) => {
      console.log(
        `[ntp] синхронизирован через ${result.host}, смещение ${result.offsetMs} мс`,
      );
    },
  });
};

const stopNtp = (): void => {
  Sntp.stop();
};

const now = (): number => Sntp.now();

export { startNtp, stopNtp, now };
