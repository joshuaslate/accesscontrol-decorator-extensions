import { filterAccess, Action, Scope, ProtectedProperty, ProtectedResource } from '../lib';

const defaultResourceOptions = {
  ownershipDeterminer: () => true,
  roleDeterminer: (role: string) => role,
  permissions: {},
};

const defaultPropertyOptions = {
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

describe('Filter function', () => {
  it('should return all properties when the user has access to all properties for the given action type', () => {
    @ProtectedResource(defaultResourceOptions)
    class FilterAllAvailable {
      @ProtectedProperty(defaultPropertyOptions)
      public testPropA: string = 'hello';

      @ProtectedProperty(defaultPropertyOptions)
      public testPropB: string = 'world';
    }

    const instanceToFilter = new FilterAllAvailable();
    const filtered = filterAccess(instanceToFilter, Action.UPDATE, 'admin');
    expect(filtered).toMatchObject(instanceToFilter);
  });

  it('should object with properties filtered out if the user does not have permission to access them', () => {
    @ProtectedResource(defaultResourceOptions)
    class FilterNotAllAvailable {
      @ProtectedProperty(defaultPropertyOptions)
      public testPropA: string = 'hello';

      @ProtectedProperty(defaultPropertyOptions)
      public testPropB: string = 'world';
    }

    const instanceToFilter = new FilterNotAllAvailable();
    const filtered = filterAccess(instanceToFilter, Action.CREATE, 'user');
    expect(Object.keys(filtered)).toHaveLength(0);
  });
});
