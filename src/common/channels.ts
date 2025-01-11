import { Config } from "./config";
import { Channel } from "./messages";
import { AnyScope } from "./variables";

export interface TailwindRequest extends Channel {
  name: "TAILWIND_REQUEST";
  handler: () => void;
}

export interface TailwindResult extends Channel {
  name: "TAILWIND_RESULT";
  handler: (result: string) => void;
}

export interface CssRequest extends Channel {
  name: "CSS_REQUEST";
  handler: () => void;
}

export interface CssResult extends Channel {
  name: "CSS_RESULT";
  handler: (result: string) => void;
}

export interface JsonRequest extends Channel {
  name: "JSON_REQUEST";
  handler: () => void;
}

export interface JsonResult extends Channel {
  name: "JSON_RESULT";
  handler: (result: string) => void;
}

export interface LoadConfigRequest extends Channel {
  name: "LOAD_CONFIG_REQUEST";
  handler: () => void;
}

export interface LoadConfigResult extends Channel {
  name: "LOAD_CONFIG_RESULT";
  handler: (payload: LoadConfigResultPayload) => void;
}

export interface SaveConfigRequest extends Channel {
  name: "SAVE_CONFIG_REQUEST";
  handler: (config: Config) => void;
}

interface LoadConfigResultPayload {
  config: Config;
  scopes: AnyScope[];
}
