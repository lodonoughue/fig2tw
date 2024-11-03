import { Config } from "./config";
import { Channel } from "./messages";
import { AnyScope } from "./variables";

export interface TailwindRequest extends Channel {
  name: "TAILWIND_REQUEST";
  handler: (config: Config) => void;
}

export interface TailwindResult extends Channel {
  name: "TAILWIND_RESULT";
  handler: (result: string) => void;
}

export interface CssRequest extends Channel {
  name: "CSS_REQUEST";
  handler: (config: Config) => void;
}

export interface CssResult extends Channel {
  name: "CSS_RESULT";
  handler: (result: string) => void;
}

export interface JsonRequest extends Channel {
  name: "JSON_REQUEST";
  handler: (config: Config) => void;
}

export interface JsonResult extends Channel {
  name: "JSON_RESULT";
  handler: (result: string) => void;
}

export interface ScopeRequest extends Channel {
  name: "SCOPE_REQUEST";
  handler: () => void;
}

export interface ScopeResult extends Channel {
  name: "SCOPE_RESULT";
  handler: (scopes: AnyScope[]) => void;
}
