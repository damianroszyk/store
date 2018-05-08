import { chain, Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

import * as fs from 'fs';
import {join} from 'path';

const corePackageVersion: string = (fs.existsSync(join(__dirname, '../../../../package.json')))
  ? require('../../../../package.json').version
  : '0.0.0';
const packageJsonPath = '/package.json';

function addDependencies(): Rule {
  return (host: Tree, context: SchematicContext) => {
    const packageName = '@ngxs/store';
    context.logger.debug(`adding dependency (${packageName})`);
    const buffer = host.read(packageJsonPath);
    if (buffer === null) {
      throw new SchematicsException('Could not find package.json');
    }

    const packageObject = JSON.parse(buffer.toString());

    packageObject.dependencies[packageName] = corePackageVersion;

    host.overwrite(packageJsonPath, JSON.stringify(packageObject, null, 2));

    return host;
  };
}

export default function (_options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
    console.log(corePackageVersion);

    return chain([
      addDependencies(),
    ])(host, context);
  };
}
