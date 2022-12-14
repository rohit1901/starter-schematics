import * as strings from '@angular-devkit/core/src/utils/strings';
import {
  apply,
  branchAndMerge,
  mergeWith,
  move,
  template,
  url,
  Rule
} from '@angular-devkit/schematics';

import { PathOptions } from '../types/path-options/path-options.interface';
import { Folders } from "../types/folders/folders.enum";

export function processTemplates<T extends PathOptions>(
  options: T,
  directory: string = options.path
): Rule {
  return branchAndMerge(
    mergeWith(
      apply(url(`.${Folders.Files}`), [
        template({
          ...strings,
          ...{ uppercase: (value: string) => value.toUpperCase() },
          ...(options as {})
        }),
        move(directory)
      ])
    )
  );
}
