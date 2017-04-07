import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

import { getDependencies, getPackagesTypesInfo, packageJsonPath } from './util';
import { PackageInfo } from './model';
import { blue, green } from 'chalk';

main();

async function main() {
  const dependencies = getDependencies();
  const packageTypes = await getPackagesTypesInfo(dependencies);

  const packageJson = require(packageJsonPath);

  const newTypeDependencies = packageTypes
    .filter(_ => {
      // add only not present types
      const currenctDependencyNames = Object.keys(packageJson.dependencies);
      return !currenctDependencyNames.includes(_.dependencyTypes.name);
    })
    .map(({dependencyTypes}) => dependencyTypes)
    .reduce(
      (agg, {name, version}) => ({...agg, [name]: version}),
      {}
    );

  const newPackageJson = {
    ...packageJson,
    dependencies: sort({
      ...packageJson.dependencies,
      ...newTypeDependencies
    })
  };

  fs.writeFileSync(packageJsonPath, JSON.stringify(newPackageJson, null, 2));
  console.log(green('package.json updated, run npm install'));
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
