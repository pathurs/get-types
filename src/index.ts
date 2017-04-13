import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

import { getDependencies, getPackagesTypesInfo, packageJsonPath, sortObjectKeys, isSetupValid } from './util';
import { PackageInfo } from './model';
import { red, green, yellow } from 'chalk';

main();
async function main() {
  const [isValid, message] = isSetupValid();
  if (!isValid) {
    console.log(red(message));
    return;
  }

  const dependencies = getDependencies();
  const packageTypes = await getPackagesTypesInfo(dependencies);

  const packageJson = require(packageJsonPath);
  const oldDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  if (Object.keys(oldDependencies).length === 0) {
    console.log(yellow('There are no dependencies in package.json'));
    return;
  }

  const newTypeDependencies = packageTypes
    .filter(_ => {
      // add only not present types
      const oldDependenciesNames = Object.keys(oldDependencies);
      return !oldDependenciesNames.includes(_.dependencyTypes.name);
    });

  if (newTypeDependencies.length === 0 ) {
    console.log(yellow('No new types was found to match dependencies'));
    return;
  }

  const newTypeDependenciesMap = newTypeDependencies
    .map(({dependencyTypes}) => dependencyTypes)
    .reduce(
      (agg, {name, version}) => ({...agg, [name]: version}),
      {}
    );

  const newPackageJson = {
    ...packageJson,
    devDependencies: sortObjectKeys({
      ...packageJson.devDependencies,
      ...newTypeDependenciesMap
    })
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));

  console.log(green('Installed types:'));
  newTypeDependencies
    .forEach(dep => {
      const {name, version} = dep.dependencyTypes;
      console.log(green(`\t${name}:${version}`));
    });
  console.log(green('package.json updated, run npm install'));
}
