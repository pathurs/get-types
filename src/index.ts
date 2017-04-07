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
    dependencies: sort({
      ...packageJson.dependencies,
      ...newTypeDependencies
    })
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
  execSync('npm install');
  console.log('we should be done');
}

function sort(obj: object) {
  return Object
    .entries(obj)
    .sort(([key1], [key2]) => {
      if (key1 > key2) {
        return 1;
      } else if (key1 < key2) {
        return -1;
      } else {
        return 0;
      }
    })
    .reduce(
      (agg, [key, value]) => ({...agg, [key]: value}),
      {}
    );
}
