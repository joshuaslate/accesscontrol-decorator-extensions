import { ResourceAuthorizationOptions } from '../../interfaces/ResourceAuthorizationOptions';
import { Action, Scope, METADATA_KEY } from '../../constants';
import { setGrant } from '../../util';
import { ResourceMetadata } from '../../interfaces';

export function ProtectedResource(options: ResourceAuthorizationOptions) {
  return function (TargetClass: any): any {
    // Add determiners for ownership and role to the decorated class
    const newMetadata: ResourceMetadata = {
      ...(Reflect.getMetadata(METADATA_KEY, TargetClass) || {}),
      ownershipDeterminer: options.ownershipDeterminer,
      roleDeterminer: options.roleDeterminer,
    };

    Reflect.defineMetadata(METADATA_KEY, newMetadata, TargetClass);
    const usableOptions = options.permissions || {};

    // Set up grants with accesscontrol instance
    Object.keys(usableOptions).forEach((role: string) => {
      Object.keys(usableOptions[role]).forEach((accessType: string) => {
        setGrant(role, TargetClass.name, accessType as Action, usableOptions[role][accessType] as Scope);
      });
    });

    return TargetClass;
  }
};
