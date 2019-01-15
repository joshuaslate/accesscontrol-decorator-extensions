import ac from '../../../lib/accesscontrol-instance';
import { ProtectedProperty, Action, Scope, filterAccess, ProtectedResource } from '../../../lib';

describe('Property Decorator: ProtectedProperty', () => {
  it('should add provided grants and exclude denials', () => {
    class ProtectFields {
      @ProtectedProperty({
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
      })
      public fakePropA: string = '';

      @ProtectedProperty({
        permissions: {
          user: {
            [Action.CREATE]: Scope.OWN,
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
      })
      public fakePropB: string = ''
    }

    expect(ac.getGrants().user.ProtectFields).toMatchObject({
      'create:own': ['!fakePropA', 'fakePropB'],
      'read:own': ['fakePropA', 'fakePropB'],
      'update:own': ['fakePropA', 'fakePropB'],
      'delete:own': ['fakePropA', 'fakePropB'],
    });

    expect(ac.getGrants().admin.ProtectFields).toMatchObject({
      'create:any': ['fakePropA', 'fakePropB'],
      'read:any': ['fakePropA', 'fakePropB'],
      'update:any': ['fakePropA', 'fakePropB'],
      'delete:any': ['fakePropA', 'fakePropB'],
    });
  });

  it('should allow decorated, nested classes to be protected', () => {
    @ProtectedResource({
      ownershipDeterminer: () => true,
      roleDeterminer: user => user.role,
    })
    class ProtectFields {
      @ProtectedProperty({
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
      })
      public fakePropA: string = 'shouldBeVisible';
    }

    @ProtectedResource({
      ownershipDeterminer: () => true,
      roleDeterminer: user => user.role,
    })
    class ProtectFieldsWithNested {
      @ProtectedProperty({
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
      })
      public protectFields: ProtectFields = new ProtectFields();

      @ProtectedProperty({
        permissions: {
          user: {
            [Action.CREATE]: '',
            [Action.READ]: '',
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
      })
      public fakePropB: string = 'shouldBeInvisible';
    }

    expect(filterAccess(new ProtectFieldsWithNested(), Action.READ, { role: 'user' })).toEqual({
      protectFields: {
        fakePropA: 'shouldBeVisible',
      },
    });
  });
});
