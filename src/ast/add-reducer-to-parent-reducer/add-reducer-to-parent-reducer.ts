import * as strings from '@angular-devkit/core/src/utils/strings';
import * as typescript from 'typescript';

import { Folders } from '../../types/folders/folders.enum';
import { getVariableDeclaration } from '../ast-helpers';
import { addImportStatementToFile } from '../ast-wrappers';
import { SourceFileModification } from '../source-file-modification.interface';

function addChildReducerToAppReducer(
  sourceFile: typescript.SourceFile,
  folderType: Folders,
  name: string,
  reducers: typescript.VariableDeclaration
): SourceFileModification[] {
  const actionReducerMap = reducers.initializer as typescript.ObjectLiteralExpression;

  if (actionReducerMap) {
    return [
      addImportStatementToFile(
        sourceFile,
        `${strings.camelize(name)}Reducer`,
        `..${folderType}/${strings.dasherize(name)}/store/${strings.dasherize(name)}.reducer`
      ),
      {
        index: actionReducerMap.properties.pos,
        toAdd: `${strings.camelize(name)}State: ${strings.camelize(name)}Reducer,`
      }
    ];
  }

  return [];
}

function addImportModification(
  sourceFile: typescript.SourceFile,
  folderType: Folders,
  childName: string
): SourceFileModification {
  return addImportStatementToFile(
    sourceFile,
    `${strings.camelize(childName)}Reducer`,
    `..${folderType}/${strings.dasherize(childName)}/store/${strings.dasherize(childName)}.reducer`
  );
}

function addChildReducerToParentReducer(
  sourceFile: typescript.SourceFile,
  folderType: Folders,
  childName: string
): SourceFileModification[] {
  const reducerFunction = sourceFile.statements.find(
    statement => statement.kind === typescript.SyntaxKind.FunctionDeclaration
  ) as typescript.FunctionDeclaration;

  const switchStatement = reducerFunction.body?.statements.find(
    statement => statement.kind === typescript.SyntaxKind.SwitchStatement
  ) as typescript.SwitchStatement;

  const defaultClause = switchStatement.caseBlock.clauses.find(
    clause => clause.kind === typescript.SyntaxKind.DefaultClause
  ) as typescript.DefaultClause;

  const returnStatement = defaultClause.statements.find(
    statement => statement.kind === typescript.SyntaxKind.ReturnStatement
  ) as typescript.ReturnStatement;

  switch (returnStatement.expression?.kind) {
    case typescript.SyntaxKind.Identifier:
      return [
        addImportModification(sourceFile, folderType, childName),
        {
          index: returnStatement.expression.pos,
          toAdd: ` { ...state, ${strings.camelize(childName)}State: ${strings.camelize(
            childName
          )}Reducer(state.${strings.camelize(childName)}State, action) };`,
          removeToIndex: returnStatement.end
        }
      ];
    case typescript.SyntaxKind.ObjectLiteralExpression:
      const newStateObject = returnStatement.expression as typescript.ObjectLiteralExpression;

      return [
        addImportModification(sourceFile, folderType, childName),
        {
          index: newStateObject.properties.end,
          toAdd: `, ${strings.camelize(childName)}State: ${strings.camelize(
            childName
          )}Reducer(state.${strings.camelize(childName)}State, action)`
        }
      ];
    default:
      return [];
  }
}

export function addReducerToParentReducer(
  sourceFile: typescript.SourceFile,
  folderType: Folders,
  name: string
): SourceFileModification[] {
  const reducers = getVariableDeclaration(sourceFile, 'ActionReducerMap');

  return reducers
    ? addChildReducerToAppReducer(sourceFile, folderType, name, reducers)
    : addChildReducerToParentReducer(sourceFile, folderType, name);
}
