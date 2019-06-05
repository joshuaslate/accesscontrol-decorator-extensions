import { Action } from './constants';
import { getPermission } from './util';

// canAccess returns true if there are any properties in the resource that a user
// can access for a given action-- otherwise false.
export function canAccess<T>(itemToCheck: T, action: Action, viewer: any): Boolean {
  const permission = getPermission<T>(itemToCheck, action, viewer);
  return permission.attributes.filter(attribute => attribute && !attribute.startsWith('!')).length > 0;
};
