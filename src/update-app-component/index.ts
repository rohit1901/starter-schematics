import { chain, Rule } from '@angular-devkit/schematics';
import { deleteFilesRule } from '../rules/delete-files.rule';
import { processTemplates } from '../rules/process-templates.rule';
import { PathOptions } from '../types/path-options/path-options.interface';

export default function(options: PathOptions): Rule {
  return chain([
    deleteFilesRule(['./src/app/app.component.html']),
    processTemplates(options, './src/app/')
  ]);
}
