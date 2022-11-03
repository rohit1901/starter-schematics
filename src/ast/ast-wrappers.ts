import {
  addDeclarationToModule,
  addImportToModule,
  addProviderToModule
} from '@schematics/angular/utility/ast-utils';
import { Change, InsertChange } from '@schematics/angular/utility/change';

import { getLastImportDeclaration } from './ast-helpers';
import { SourceFileModification } from './source-file-modification.interface';
import { SourceFile } from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";

function mapInsertChangesToModifications(changes: Change[]) {
  return changes.map(mapInsertChangeToModification);
}

function mapInsertChangeToModification(change: Change) {
  const insertChange = change as InsertChange;

  return {
    index: insertChange.pos,
    toAdd: insertChange.toAdd
  };
}

export function addImportStatementToFile(
  sourceFile: SourceFile,
  symbolToImport: string,
  importPath: string
): SourceFileModification {
  const importDeclaration = getLastImportDeclaration(sourceFile);

  return {
    index: importDeclaration ? importDeclaration.end : 0,
    toAdd: `import { ${symbolToImport} } from '${importPath}';\n`
  };
}

export function addProviderToNgModule(
  sourceFile: SourceFile,
  filename: string,
  classifiedName: string,
  importPath: string
): SourceFileModification[] {
  return mapInsertChangesToModifications(
    addProviderToModule(sourceFile, filename, classifiedName, importPath)
  );
}

export function addImportToNgModule(
  sourceFile: SourceFile,
  filename: string,
  classifiedName: string,
  importPath: string
): SourceFileModification[] {
  return mapInsertChangesToModifications(
    addImportToModule(sourceFile, filename, classifiedName, importPath)
  );
}

export function addDeclarationToNgModule(
  sourceFile: SourceFile,
  filename: string,
  classifiedName: string,
  importPath: string
): SourceFileModification[] {
  return mapInsertChangesToModifications(
    addDeclarationToModule(sourceFile, filename, classifiedName, importPath)
  );
}
