import { Scope } from './Scope';

export const MISSING_OWNERSHIP_DETERMINER = `${Scope.OWN} scope defined but no ownershipDeterminer passed to @ProtectedResource decorator.`;
export const MISSING_ROLE_DETERMINER = 'roleDeterminer must be passed to @ProtectedResource decorator.';