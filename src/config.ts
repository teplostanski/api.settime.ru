const Defaults = {
  Port: 8080,
  NtpHost:
    'ru.pool.ntp.org,0.ru.pool.ntp.org,1.ru.pool.ntp.org,time.google.com',
  NtpPort: 123,
  NtpTimeoutMs: 5000,
  NtpSyncIntervalMs: 3_600_000,
  NtpStartupAttempts: 3,
} as const;

type Config = {
  port: number;
  ntp: {
    hosts: string[];
    port: number;
    timeout: number;
    syncIntervalMs: number;
    startupAttempts: number;
  };
};

const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseHostList = (hosts: string) => {
  return hosts
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);
};

const parseNtpHosts = (value: string | undefined): string[] => {
  const hosts = parseHostList(value ?? Defaults.NtpHost);
  const defaultHosts = parseHostList(Defaults.NtpHost);

  return hosts.length > 0 ? hosts : defaultHosts;
};

const config: Config = {
  port: toNumber(process.env.PORT, Defaults.Port),
  ntp: {
    hosts: parseNtpHosts(process.env.NTP_HOST),
    port: toNumber(process.env.NTP_PORT, Defaults.NtpPort),
    timeout: toNumber(process.env.NTP_TIMEOUT_MS, Defaults.NtpTimeoutMs),
    syncIntervalMs: toNumber(
      process.env.NTP_SYNC_INTERVAL_MS,
      Defaults.NtpSyncIntervalMs,
    ),
    startupAttempts: toNumber(
      process.env.NTP_STARTUP_ATTEMPTS,
      Defaults.NtpStartupAttempts,
    ),
  },
};

export { config };
