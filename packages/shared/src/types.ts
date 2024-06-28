export type DeepPartial<T> = T extends object
  ? {
      [K in keyof T]?: DeepPartial<T>;
    }
  : T;
