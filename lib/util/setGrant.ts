import ac from '../accesscontrol-instance';
import { Action, GRANT_METHODS, Scope } from '../constants';

const ALL_SYMBOL = '*';

export const setGrant = (role: string, resource: string, action: Action, scope?: Scope, field?: string) => {
  const argsForGrant: (string | string[])[] = [resource];
  try {
    const permissions = ac.permission({
      role,
      resource,
      action: `${action}:${scope}`,
    });

    if (permissions.attributes.length) {
      const newAttributes = field
        ? permissions.attributes.length === 1 && permissions.attributes[0] === ALL_SYMBOL
          ? [field]
          : [...permissions.attributes, field]
        : permissions.attributes;

      argsForGrant.push(newAttributes);
    } else {
      argsForGrant.push([field || ALL_SYMBOL])
    }
    
  } catch (err) {
    argsForGrant.push([field || ALL_SYMBOL]);
  }

  // TODO: Clean up and make more type-safe
  const grantMethodName = GRANT_METHODS[action][scope || ''];
  if (scope && (scope === Scope.OWN || scope === Scope.ANY)) {
    (ac.grant(role) as any)[grantMethodName](...argsForGrant);
  } else {
    (ac.deny(role) as any)[grantMethodName](...argsForGrant);
  }
};
