import * as fs from 'fs';
import * as typescript from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { SourceFile, Statement } from "@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript";

export function openSourceFileFromFileSystem(filename: string) {
  return openSourceFile(filename, () => fs.readFileSync(filename, 'utf-8'));
}

export function openSourceFile(filename: string, readSourceText: () => string) {
  if (filename) {
    const sourceText = readSourceText();

    if (sourceText) {
      return typescript.createSourceFile(
        filename,
        sourceText,
        typescript.ScriptTarget.Latest,
        true
      ) as typescript.SourceFile;
    }
  }

  return null;
}

export function getAllImportDeclarations(sourceFile: SourceFile): Statement[] {
  return sourceFile.statements.filter(
    statement => statement.kind === typescript.SyntaxKind.ImportDeclaration
  );
}

export function getLastImportDeclaration(sourceFile: SourceFile) {
  return getAllImportDeclarations(sourceFile).reduce((lastDeclaration, declaration) => {
    return lastDeclaration
      ? lastDeclaration['pos'] > declaration.pos
        ? lastDeclaration
        : declaration
      : declaration;
  }, null);
}
