import ac from '../../../lib/accesscontrol-instance';
import { ProtectedResource, Action, Scope } from '../../../lib';

describe('Class Decorator: ProtectedResource', () => {
  it('should add a resource to authorization schema in container by class name', () => {
    @ProtectedResource({
      ownershipDeterminer: () => true,
      roleDeterminer: () => '',
      permissions: {
        admin: {
          [Action.CREATE]: Scope.ANY,
          [Action.READ]: Scope.ANY,
          [Action.UPDATE]: '',
          [Action.DELETE]: Scope.OWN,
        },
      },
    })
    class FakeResourceA { }

    expect(ac.getGrants().admin.FakeResourceA).toMatchObject({
      'create:any': ['*'],
      'read:any': ['*'],
      'update:own': [],
      'delete:own': ['*'],
    });
  });
});
