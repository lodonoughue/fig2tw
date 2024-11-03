import { Config } from "@common/config";
import { loadVariables } from "./variables";
import { AnyVariable } from "@common/variables";
import { chain } from "lodash";

export async function exportJson(config: Config) {
  const variables = await loadVariables();
  return JSON.stringify(convertToJson(variables), null, config.tabWidth);
}

function convertToJson(variables: AnyVariable[]) {
  return chain(variables).keyBy("key").value();
}
