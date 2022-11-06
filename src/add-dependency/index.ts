import { chain, noop, Rule } from "@angular-devkit/schematics";
import { NodeDependencyType } from '@schematics/angular/utility/dependencies';

import { addNpmDependenciesRule } from '../rules/add-npm-dependencies.rule';
import { runNpmInstallRule } from '../rules/run-npm-install.rule';
import { DependencyOptions } from "../types/dependency-options/dependency-options";
import { isDependencyOptions } from "../types/dependency-options/dependency-functions";

export default function(options: DependencyOptions): Rule {
  if(!options.dependencyVersion) options.dependencyVersion = 'latest';
  if(!isDependencyOptions(options)) return noop();
  const {dependencyName: name, dependencyVersion: version} = options;
  return chain([
    addNpmDependenciesRule([
      { type: NodeDependencyType.Dev, version, name },
    ]),
    runNpmInstallRule()
  ]);
}
