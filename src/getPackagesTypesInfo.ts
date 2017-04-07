import { getPackageTypes } from './checkForTypes';
import { PackageInfo, TypesAwerePackageInfo } from './model';

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
