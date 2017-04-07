import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

import { getDependencies, getPackagesTypesInfo, packageJsonPath, sortObjectKeys } from './util';
import { PackageInfo } from './model';
import { blue, green } from 'chalk';

main();

async function main() {
  const dependencies = getDependencies();
  const packageTypes = await getPackagesTypesInfo(dependencies);

  const packageJson = require(packageJsonPath);
  const oldDependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  };

  const newTypeDependencies = packageTypes
    .filter(_ => {
      // add only not present types
      const oldDependenciesNames = Object.keys(oldDependencies);
      return !oldDependenciesNames.includes(_.dependencyTypes.name);
    })
    .map(({dependencyTypes}) => dependencyTypes)
    .reduce(
      (agg, {name, version}) => ({...agg, [name]: version}),
      {}
    );

  const newPackageJson = {
    ...packageJson,
    devDependencies: sortObjectKeys({
      ...packageJson.devDependencies,
      ...newTypeDependencies
    })
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
  console.log(green('package.json updated, run npm install'));
}
