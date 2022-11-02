import { DependencyOptions } from "./dependency-options";

export function isDependencyOptions(options: any): options is DependencyOptions {
  return !!(typeof options === 'object' && options['name'] && options ['version']);
}