import { chain, DirEntry, Rule } from '@angular-devkit/schematics';

import { addDefaultValueToParentStateFunctions } from '../ast/add-default-value-to-parent-state-functions/add-default-value-to-parent-state-functions';
import { addReducerToParentReducer } from '../ast/add-reducer-to-parent-reducer/add-reducer-to-parent-reducer';
import { addStateMemberToParentStateInterface } from '../ast/add-state-member-to-parent-state-interface/add-state-member-to-parent-state-interface';
import { modifySourceFile } from '../rules/modify-source-file.rule';
import { processTemplates } from '../rules/process-templates.rule';
import { getSubDirEntry } from '../rules/tree-helpers';
import { Folders } from '../types/folders/folders.enum';
import { getFolderType } from '../types/path-options/path-options.functions';
import {
  getContainingFolderPath,
  validateRegularSchema
} from '../types/schema-options/schema-options.functions';
import { SchemaOptions } from '../types/schema-options/schema-options.interface';

function findParentReducerFile(directory: DirEntry, name: string): string | null {
  const storeDirEntry = getSubDirEntry(directory, ['store']);

  if (storeDirEntry) {
    const reducerPath = storeDirEntry.subfiles.find(
      file => file.includes('.reducer.ts') && file !== `${name}.reducer.ts`
    );
    if (reducerPath) {
      const file = storeDirEntry.file(reducerPath)
      return file?.path ?? '';
    }
  }

  return directory.parent ? findParentReducerFile(directory.parent, name) : null;
}

function findParentStateTypesFile(directory: DirEntry, extension: string, name: string): string | null {
  const typesDirEntry = getSubDirEntry(directory, ['types']);

  if (typesDirEntry) {
    const statePath = typesDirEntry.subdirs.find(dir => dir.includes('-state'));

    if (statePath) {
      const stateDirEntry = typesDirEntry.dir(statePath);

      const stateTypeFilePath = stateDirEntry.subfiles.find(
        file => file.includes(`-state.${extension}.ts`) && file !== `${name}-state.${extension}.ts`
      );

      if (stateTypeFilePath) {
        const file = stateDirEntry.file(stateTypeFilePath)
        return file?.path ?? '';
      }
    }
  }

  return directory.parent ? findParentStateTypesFile(directory.parent, extension, name) : null;
}

export default function(options: SchemaOptions): Rule {
  validateRegularSchema(options);

  options.path = getContainingFolderPath(options.path, Folders.Store);

  const folderType = getFolderType(options);

  return chain([
    processTemplates(options, options.path),
    modifySourceFile(
      tree => findParentReducerFile(tree.getDir(options.path), options.name) ?? '',
      sourceFile => addReducerToParentReducer(sourceFile, folderType, options.name)
    ),
    modifySourceFile(
      tree => findParentStateTypesFile(tree.getDir(options.path), 'interface', options.name) ?? '',
      sourceFile => addStateMemberToParentStateInterface(sourceFile, folderType, options.name)
    ),
    modifySourceFile(
      tree => findParentStateTypesFile(tree.getDir(options.path), 'functions', options.name) ?? '',
      sourceFile => addDefaultValueToParentStateFunctions(sourceFile, folderType, options.name)
    )
  ]);
}
