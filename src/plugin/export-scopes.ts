import { loadVariables } from "./variables";
import { chain } from "lodash";

export async function exportScopes() {
  const variables = await loadVariables();
  return chain(variables)
    .flatMap(it => it.scopes)
    .uniq()
    .value();
}
