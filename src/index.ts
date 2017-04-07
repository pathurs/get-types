import * as path from 'path';
import { getDependencies, packageJsonPath } from './findDependencies';
import { getPackageTypes } from './checkForTypes';
import { PackageInfo } from './model';
import { getPackagesTypesInfo } from './getPackagesTypesInfo';
import * as fs from 'fs';
import {execSync} from 'child_process';

main();

async function main() {
  const dependencies = getDependencies();
  const packageTypes = await getPackagesTypesInfo(dependencies);

  const newTypeDependencies = packageTypes
    .map(({dependencyTypes}) => dependencyTypes)
    .reduce(
      (agg, {name, version}) => ({...agg, [name]: version}),
      {}
    );

  const packageJson = require(packageJsonPath);
  const newPackageJson = {
    ...packageJson,
    dependencies: {
      ...packageJson.dependencies,
      ...newTypeDependencies
    }
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
  execSync('npm install');
  console.log('we should be done');
}
