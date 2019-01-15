import ac from '../accesscontrol-instance';
import { Action, GRANT_METHODS, Scope } from '../constants';

const ALL_SYMBOL = '*';

export const setGrant = (role: string, resource: string, action: Action, scope?: Scope, field?: string) => {
  const argsForGrant: (string | string[])[] = [resource];
  // If not granting, then we are denying and need to negate the field
  const isGranting = scope && (scope === Scope.OWN || scope === Scope.ANY);
  const assignableGrant = field
    ? `${isGranting ? '' : '!'}${field}`
    : scope ? ALL_SYMBOL : '';

  try {
    const permissions = ac.permission({
      role,
      resource,
      action: `${action}:${scope || Scope.OWN}`,
    });

    if (permissions.attributes.length) {
      const newAttributes = field
        ? permissions.attributes.length === 1 && permissions.attributes[0] === ALL_SYMBOL
          ? [assignableGrant]
          : [...permissions.attributes, assignableGrant]
        : permissions.attributes;

      argsForGrant.push(newAttributes);
    } else {
      argsForGrant.push([assignableGrant])
    }
    
  } catch (err) {
    argsForGrant.push([assignableGrant]);
  }

  const grantMethodName = GRANT_METHODS[action][scope || ''];
  (ac.grant(role) as any)[grantMethodName](...argsForGrant);

  // If "any" scope is being set, let's be sure "own" is also set so the viewer
  // can still access their own resources
  if (scope === Scope.ANY) {
    setGrant(role, resource, action, Scope.OWN, field);
  }
};
