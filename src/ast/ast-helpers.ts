import * as fs from 'fs';
import * as typescript from 'typescript';


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

export function getAllImportDeclarations(sourceFile: typescript.SourceFile) {
  return sourceFile.statements.filter(
    statement => statement.kind === typescript.SyntaxKind.ImportDeclaration
  );
}
