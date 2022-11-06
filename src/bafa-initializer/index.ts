import { chain, schematic, Rule } from "@angular-devkit/schematics";

import { SchemaOptions } from "../types/schema-options/schema-options.interface";

export default function(options: SchemaOptions): Rule {
  const dependencyOptions: SchemaOptions = {
    ...options, //TODO: replace lodash with `bafa-ui-library`
    dependencyName: "lodash"
  };
  return chain([
    schematic("update-app-component", options),
    schematic("add-dependency", dependencyOptions),
    schematic("prettify-and-lint", options),
    schematic("add-assets", options),
    //TODO: duplicate add-service to add multiple services
    schematic("add-service", {
      ...options,
      serviceName: "auth"
    })
  ]);
}
