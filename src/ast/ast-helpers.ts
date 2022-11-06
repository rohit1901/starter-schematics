import * as fs from 'fs';
import * as typescript from 'typescript';
import {
  ArrayTypeNode, createSourceFile, Identifier,
  InterfaceDeclaration,
  NodeArray, ObjectLiteralElement,
  ObjectLiteralExpression, PropertyAssignment, ScriptTarget,
  SourceFile,
  Statement,
  SyntaxKind, TextRange, TypeReferenceNode, VariableDeclaration, VariableStatement, Node
} from "typescript";
import { getDecoratorMetadata } from "@schematics/angular/utility/ast-utils";
import { SourceFileModification } from "./source-file-modification.interface";

export function openSourceFileFromFileSystem(filename: string) {
  return openSourceFile(filename, () => fs.readFileSync(filename, 'utf-8'));
}

export function openSourceFile(filename: string, readSourceText: () => string) {
  if (filename) {
    const sourceText = readSourceText();

    if (sourceText) {
      return createSourceFile(
        filename,
        sourceText,
        ScriptTarget.Latest,
        true
      ) as SourceFile;
    }
  }

  return null;
}

export function getNgModuleNode(
  sourceFile: SourceFile
): ObjectLiteralExpression | null {
  const nodes = getDecoratorMetadata(sourceFile, 'NgModule', '@angular/core');

  return nodes.length === 1 && nodes[0].kind === SyntaxKind.ObjectLiteralExpression
    ? (nodes[0] as ObjectLiteralExpression)
    : null;
}

export function getAllImportDeclarations(sourceFile: SourceFile): Statement[] {
  return sourceFile.statements.filter(
    statement => statement.kind === SyntaxKind.ImportDeclaration
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

export function getInterfaceDeclarationByType(
  sourceFile: SourceFile,
  type: string
): InterfaceDeclaration {
  return sourceFile.statements.find(
    statement =>
      statement.kind === SyntaxKind.InterfaceDeclaration &&
      (statement as InterfaceDeclaration).name.getText() === type
  ) as InterfaceDeclaration;
}

export function getVariableDeclaration(
  sourceFile: SourceFile,
  type: string
): VariableDeclaration | null {
  return sourceFile.statements
    .filter(statement => statement.kind === SyntaxKind.VariableStatement)
    .map(statement => (statement as VariableStatement).declarationList.declarations)
    .filter(declarations =>
      declarations.some(declaration => {
        const declarationType = declaration.type;
        if(!declarationType) return;
        switch (declarationType.kind) {
          case SyntaxKind.TypeReference:
            return (declarationType as TypeReferenceNode).typeName.getText() === type;
          case SyntaxKind.ArrayType:
            return (
              ((declarationType as ArrayTypeNode)
                .elementType as TypeReferenceNode).typeName.getText() === type
            );
          default:
            return false;
        }
      })
    )
    .reduce(
      (declaration: VariableDeclaration, declarations) =>
        declarations.length > 0 ? declarations[0] : declaration,
      null
    );
}


export function getTypeArgumentOfVariableDeclaration(
  variableDeclaration: typescript.VariableDeclaration
) {
  switch (variableDeclaration.type?.kind) {
    case typescript.SyntaxKind.TypeReference:
      return (variableDeclaration.type as TypeReferenceNode).typeArguments?.[0];
    case typescript.SyntaxKind.ArrayType:
      return ((variableDeclaration.type as ArrayTypeNode).elementType as typescript.TypeReferenceNode).typeArguments?.[0];
  }
}

export function getObjectProperty(
  properties: NodeArray<ObjectLiteralElement>,
  propertyName: string
): PropertyAssignment {
  return properties
    .filter(property => property.kind === SyntaxKind.PropertyAssignment)
    .filter(property => property.name?.kind === SyntaxKind.Identifier)
    .find(
      property => (property.name as Identifier).text === propertyName
    ) as PropertyAssignment;
}

export function filterNodeArray<T extends Node>(
  array: NodeArray<T>,
  condition: (node: T) => boolean
): NodeArray<T> {
  const textRange = {
    pos: array.pos,
    end: array.end
  };

  const newArray = (array.filter(condition) as {}) as NodeArray<T>;
  return { ...newArray, pos: textRange.pos, end: textRange.end };
}

export function insertIntoArray(
  array: NodeArray<Node>,
  symbolToInsert: string
): SourceFileModification {
  return {
    index:
      array.length >= 1 ? array[array.length - 1].end : ((array as {}) as TextRange).end,
    toAdd: array.length >= 1 ? `, ${symbolToInsert}` : symbolToInsert
  };
}
