import { chain, schematic, Rule, externalSchematic } from "@angular-devkit/schematics";

import { SchemaOptions } from "../types/schema-options/schema-options.interface";
import { Schema } from "@schematics/angular/ng-new/schema";

export default function(options: SchemaOptions): Rule {
  const dependencyOptions: SchemaOptions = {
    ...options, //TODO: replace lodash with `bafa-ui-library`
    dependencyName: "lodash"
  };
  const ngNewOptions: Partial<Schema> = {
    createApplication: true,
    directory: './',
    skipGit: true,
    version: '14.2.8'
  }
  return chain([
    externalSchematic('@schematics/angular', 'ng-new', ngNewOptions),
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
