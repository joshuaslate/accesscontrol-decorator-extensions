import { Permission } from 'accesscontrol';
import ac from './accesscontrol-instance';
import {
  Action,
  METADATA_KEY,
  MISSING_OWNERSHIP_DETERMINER,
  Scope,
  MISSING_ROLE_DETERMINER,
  GRANT_METHODS,
} from './constants';
import { ResourceMetadata } from './interfaces';

export function filterAccess<T>(itemToFilter: T, action: Action, viewer: any): Partial<T> {
  const resource = itemToFilter.constructor.name;
  const instanceMetadata: ResourceMetadata = Reflect.getMetadata(METADATA_KEY, itemToFilter.constructor);

  if (!instanceMetadata.roleDeterminer && typeof viewer !== 'string') {
    throw new Error(MISSING_ROLE_DETERMINER);
  }

  const viewerRole: string = typeof viewer === 'string'
    ? viewer
    : instanceMetadata.roleDeterminer!(viewer);

  const hasOwnGrants = ac.permission({
    resource,
    role: viewerRole,
    action: `${action}:${Scope.OWN}`
  }).attributes.length > 0;

  if (!instanceMetadata.ownershipDeterminer && hasOwnGrants) {
    throw new Error(MISSING_OWNERSHIP_DETERMINER);
  }

  const isOwner = instanceMetadata.ownershipDeterminer(viewer, itemToFilter);

  // TODO: Clean up and make more type-safe
  const grantMethodName = GRANT_METHODS[action][isOwner ? Scope.OWN : Scope.ANY];
  const permission: Permission = (ac.can(viewerRole) as any)[grantMethodName](resource);

  return permission.filter(itemToFilter);
};
