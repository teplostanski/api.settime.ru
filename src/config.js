const toNumber = (value, fallback) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseNtpHosts = (value) => {
  const hosts = (value ?? 'pool.ntp.org,time.google.com,time.cloudflare.com')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean);

  return hosts.length > 0 ? hosts : ['pool.ntp.org'];
};

const config = {
  port: toNumber(process.env.PORT, 8080),
  ntp: {
    hosts: parseNtpHosts(process.env.NTP_HOST),
    port: toNumber(process.env.NTP_PORT, 123),
    timeout: toNumber(process.env.NTP_TIMEOUT_MS, 5000),
    syncIntervalMs: toNumber(process.env.NTP_SYNC_INTERVAL_MS, 3_600_000),
    startupAttempts: toNumber(process.env.NTP_STARTUP_ATTEMPTS, 3),
  },
};

export { config };
