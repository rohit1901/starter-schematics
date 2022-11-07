import { Rule, Tree } from "@angular-devkit/schematics";
import { deleteFolder } from "./tree-helpers";

export function deleteFolderRule(folderPath: string): Rule {
  return (tree: Tree) => {
    deleteFolder(tree, folderPath);
  };
}