import fetch from 'node-fetch';
import * as path from 'path';
import { TypesAwerePackageInfo, PackageInfo } from './model';

// constants
export const packageJsonPath = path.resolve(process.cwd(), './package.json');

// util functions
export function getPackageTypes(packageName: string): Promise<PackageInfo> {
  const typeName = '@' + encodeURIComponent(`types/${packageName}`);

  return fetch(`http://registry.npmjs.org/${typeName}`)
    .then(res => res.json())
    .then(json => ({
      name: `@types/${packageName}`,
      version: json['dist-tags'].latest,
    }))
    .catch(_ => null);
}

export function getPackagesTypesInfo(packages: PackageInfo[]): Promise<TypesAwerePackageInfo[]> {
  const getTypesForAll = packages.map((dependency) => {
    return getPackageTypes(dependency.name)
      .then(dependencyTypes => ({
        dependencyTypes,
        dependency
      }));
  });

  return Promise.all(getTypesForAll)
    .then(libsAndTypes => libsAndTypes.filter(_ => !!_.dependencyTypes));
}

export function getDependencies(): PackageInfo[] {
  const packageJson = require(packageJsonPath);
  const dependencies = { ...packageJson.dependencies };

  return Object.entries(dependencies)
    .map(([name, version]) => ({name, version}) )
    .filter(({name}) => {
      return !name.includes('@types/');
    });
}

export function sortObjectKeys(obj: object) {
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
