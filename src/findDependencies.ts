import * as path from 'path';

interface PackageInfo {
  name: string;
  version: string;
}

export const packageJsonPath = path.resolve(process.cwd(), './package.json');

export function getDependencies(): PackageInfo[] {
  const packageJson = require(packageJsonPath);
  const dependencies = { ...packageJson.dependencies };

  return Object.entries(dependencies)
    .map(([name, version]) => ({name, version}) )
    .filter(({name}) => {
      return !name.includes('@types/');
    });
}
