interface Alert<T extends string> {
  type: T;
  title: string;
  description: string;
}

export type Info = Alert<"info">;
export type Warning = Alert<"warning">;
export type AnyAlert = Info | Warning;

interface AlertManager {
  readonly alerts: AnyAlert[];
  info(title: string, description: string): void;
  warn(title: string, description: string): void;
}
