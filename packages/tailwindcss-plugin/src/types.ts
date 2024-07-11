/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
type BuiltIns =
  | string
  | boolean
  | number
  | bigint
  | symbol
  | Function
  | Array<any>;

export type DeepPartial<T> = T extends BuiltIns
  ? T
  : T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;
