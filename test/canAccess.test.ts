import { canAccess, Action, Scope, ProtectedProperty, ProtectedResource } from '../lib';

const defaultResourceOptions = {
  ownershipDeterminer: () => true,
  roleDeterminer: (role: string) => role,
  permissions: {
    user: {
      [Action.CREATE]: '',
      [Action.READ]: Scope.OWN,
      [Action.UPDATE]: Scope.OWN,
      [Action.DELETE]: Scope.OWN,
    },
    admin: {
      [Action.CREATE]: Scope.ANY,
      [Action.READ]: Scope.ANY,
      [Action.UPDATE]: Scope.ANY,
      [Action.DELETE]: Scope.ANY,
    },
  },
};

const defaultPropertyOptions = {
  permissions: {},
};

describe('canAccess function', () => {
  it('should return true if a user can perform an action against the full resource', () => {
    @ProtectedResource(defaultResourceOptions)
    class AProtectedResource {
      @ProtectedProperty(defaultPropertyOptions)
      public testPropA: string = 'hello';

      @ProtectedProperty(defaultPropertyOptions)
      public testPropB: string = 'world';
    }

    const instanceToCheck = new AProtectedResource();

    Object.values(Action).forEach(action => {
      expect(canAccess(instanceToCheck, action, 'admin')).toBe(true);

      if (action !== Action.CREATE) {
        expect(canAccess(instanceToCheck, action, 'user')).toBe(true);
      }
    })
  });

  it('should return false if a user cannot perform an action against the full resource', () => {
    @ProtectedResource(defaultResourceOptions)
    class AProtectedResource {
      @ProtectedProperty(defaultPropertyOptions)
      public testPropA: string = 'hello';

      @ProtectedProperty(defaultPropertyOptions)
      public testPropB: string = 'world';
    }

    const instanceToCheck = new AProtectedResource();

    expect(canAccess(instanceToCheck, Action.CREATE, 'user')).toBe(false);
  });
});
