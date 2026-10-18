import type {ServerType} from "@hono/node-server";

type CloseOnSignalParams = {
  onClosed?: (signal: NodeJS.Signals) => unknown;
  onClosing?: (signal: NodeJS.Signals) => unknown;
  onError?: (signal: NodeJS.Signals, error: unknown) => unknown;
  server: ServerType;
  signal: NodeJS.Signals;
};

type CloseOnSignalsParams = Omit<CloseOnSignalParams, "signal">;

const closeOnSignal = ({
  onClosed,
  onClosing,
  onError,
  server,
  signal
}: CloseOnSignalParams) => {
  process.on(signal, () => {
    onClosing?.(signal);

    server.close(error => {
      if (error) {
        onError?.(signal, error);

        process.exit(1);
      }

      onClosed?.(signal);

      process.exit(0);
    });
  });
};

const handledSignals = ["SIGINT", "SIGTERM"] as const;

const closeOnSignals = (params: CloseOnSignalsParams) =>
  handledSignals.forEach(signal => closeOnSignal({...params, signal}));

export {closeOnSignals};
