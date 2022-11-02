import {Rule, Tree} from '@angular-devkit/schematics';
import * as prettier from 'prettier';
import {getTouchedFiles} from './tree-helpers';

/* tslint:disable-next-line */
const prettierConfig = require('../schematics/prettify-and-lint/files/prettier.config');

export function runPrettier(): Rule {
    return (tree: Tree) => {
        getTouchedFiles(tree).forEach(file => {
            const readFile = tree.read(file);
            if (!readFile) return;
            tree.overwrite(
                file,
                prettier.format(readFile.toString(), {
                    ...prettierConfig,
                    parser: 'typescript'
                })
            );
        });
    };
}
