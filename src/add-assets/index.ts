import { PathOptions } from "../types/path-options/path-options.interface";
import { chain, Rule } from "@angular-devkit/schematics";
import { processTemplates } from "../rules/process-templates.rule";
import { deleteFolderRule } from "../rules/delete-folder.rule";
import { Folders } from "../types/folders/folders.enum";

export default function(options: PathOptions): Rule {
  const AssetsPath = '.' + Folders.Parent + Folders.Assets;
  return chain([
    deleteFolderRule(AssetsPath),
    processTemplates(options, AssetsPath),
  ]);
}
