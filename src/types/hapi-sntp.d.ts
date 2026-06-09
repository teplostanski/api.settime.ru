declare module '@hapi/sntp' {
  type SntpTimeOptions = {
    host: string;
    port?: number;
    timeout?: number;
  };

  type SntpTimeResult = {
    t: number;
  };

  const Sntp: {
    time: (options: SntpTimeOptions) => Promise<SntpTimeResult>;
  };

  export default Sntp;
}
