import { SchemaOptions } from "../schema-options/schema-options.interface";

export interface DependencyOptions extends SchemaOptions{
  dependencyVersion: string;
}