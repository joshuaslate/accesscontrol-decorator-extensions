import { Action, Scope } from './';

export const GRANT_METHODS = {
  [Action.CREATE]: {
    [Scope.ANY]: 'createAny',
    [Scope.OWN]: 'createOwn',
    '': 'createOwn',
  },
  [Action.READ]: {
    [Scope.ANY]: 'readAny',
    [Scope.OWN]: 'readOwn',
    '': 'readOwn',
  },
  [Action.UPDATE]: {
    [Scope.ANY]: 'updateAny',
    [Scope.OWN]: 'updateOwn',
    '': 'updateOwn',
  },
  [Action.DELETE]: {
    [Scope.ANY]: 'deleteAny',
    [Scope.OWN]: 'deleteOwn',
    '': 'deleteOwn',
  },
};
