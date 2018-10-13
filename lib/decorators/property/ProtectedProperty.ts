import { PropertyAuthorizationOptions } from '../../interfaces/PropertyAuthorizationOptions';
import { Action, Scope } from '../../constants';
import { setGrant } from '../../util';

export function ProtectedProperty(options: PropertyAuthorizationOptions) {
  return (target: any, key: string) => {
    Object.keys(options.permissions).forEach((role: string) => {
      Object.keys(options.permissions[role]).forEach((accessType: string) => {
        setGrant(role, target.constructor.name, accessType as Action, options.permissions[role][accessType] as Scope, key);
      });
    });
  };
};
