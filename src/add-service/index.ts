import * as strings from '@angular-devkit/core/src/utils/strings';
import { chain, Rule } from '@angular-devkit/schematics';

import { addProviderToNgModule } from '../ast/ast-wrappers';
import { modifySourceFile } from '../rules/modify-source-file.rule';
import { processTemplates } from '../rules/process-templates.rule';
import { findModuleFilenameInTree } from '../rules/tree-helpers';
import { Folders } from '../types/folders/folders.enum';
import {
  getContainingFolderPath,
  validateServiceSchema
} from "../types/schema-options/schema-options.functions";
import { SchemaOptions } from '../types/schema-options/schema-options.interface';

export default function(options: SchemaOptions): Rule {
  validateServiceSchema(options);
  if(!options.path) options.path = Folders.Parent + Folders.Application;
  options.path = getContainingFolderPath(options.path, Folders.Services);
  options.name = options.serviceName;
  return chain([
    processTemplates(options),
    modifySourceFile(
      tree => findModuleFilenameInTree(tree, options) ?? '',
      (sourceFile, moduleFilename) =>
        addProviderToNgModule(
          sourceFile,
          moduleFilename,
          strings.classify(`${options.serviceName}Service`),
          `.${Folders.Services}/${strings.dasherize(options.serviceName)}.service`
        )
    )
  ]);
}
