import { Action, Scope } from './';

type GRANT_METHODS_TYPE = {
  [key in Action]: {
    [scopeKey in Scope | '']: string;
  };
};

export const GRANT_METHODS: GRANT_METHODS_TYPE = {
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
