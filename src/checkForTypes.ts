import fetch from 'node-fetch';
import { PackageInfo } from './model';

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
