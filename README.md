# accesscontrol-decorator-extensions
Control access to whole instances or individual properties on those instances with ease, powered by [accesscontrol](https://www.npmjs.com/package/accesscontrol).

Note: I am developing this for a side-project of mine, and will add features/fix issues as I encounter them. If you have a use-case that is not yet covered, please open an issue (or better yet, a pull request).

## Get Started
```bash
yarn add accesscontrol-decorator-extensions
```

or

```bash
npm install --save accesscontrol-decorator-extensions
```

You will need to decorate the class you would like to control access to with the `@ProtectedResource` decorator. You can further control access to individual properties with the `@ProtectedProperty` decorator. For example:

```ts
import {
  Action,
  ProtectedProperty,
  ProtectedResource,
  Scope,
} from 'accesscontrol-decorator-extensions';

@ProtectedResource({
  /**
   * The viewer will be the identifier of the consumer, the instance will be the instance of
   * the ProtectedResource decorated class that you are trying to control access to.
   * 
   * ownershipDeterminer is a function that determines whether or not a viewer owns the instance
   * roleDeterminer is either the viewer's role (string) or a function that returns the viewer's role
  */
  ownershipDeterminer: (viewer: User, instance: User) => viewer.id === userResult.id,
  roleDeterminer: (viewer: User) => viewer.role,
})
class User {
  public id: number;

  @ProtectedProperty({
    permissions: {
      admin: {
        [Action.CREATE]: Scope.ANY,
        [Action.READ]: Scope.ANY,
        [Action.UPDATE]: Scope.ANY,
        [Action.DELETE]: Scope.ANY,
      },
      user: {
        [Action.CREATE]: Scope.OWN,
        [Action.READ]: Scope.ANY,
        [Action.UPDATE]: Scope.OWN,
        [Action.DELETE]: Scope.OWN,
      },
    },
  })
  public username: string;

  @ProtectedProperty({
    permissions: {
      admin: {
        [Action.CREATE]: Scope.ANY,
        [Action.READ]: Scope.ANY,
        [Action.UPDATE]: Scope.ANY,
        [Action.DELETE]: Scope.ANY,
      },
      user: {
        [Action.CREATE]: '',
        [Action.READ]: Scope.OWN,
        [Action.UPDATE]: '',
        [Action.DELETE]: '',
      },
    },
  })
  public role: string;
}
```

Then for actually filtering the action, you would do something like this (imagine in an Express-like context):
```ts
import { Action, filterAccess } from 'accesscontrol-decorator-extensions';

export const editUser = async (req, res) => {
  // In this instance, a middleware prior to editUser running places the viewer on the request object
  const { body, params, user } = req;

  const userToUpdate = await db.findOne(params.userId);

  // Change the user's username based on data in the request body
  userToUpdate.username = body.username;

  // This will ensure that the user is only updating fields they have access to update
  const filteredUserUpdates: Partial<User> = filterAccess(user, Action.UPDATE, userToUpdate);
  const savedUser = await db.save(filteredUserUpdates);

  res.json({
    success: true,
    user: savedUser,
  });
};
```

### TypeScript Configuration
```ts
{
  "target": "es2015", // at least
  "experimentalDecorators": true
}
```

## Contribution
Feel free to contribute by forking this repository, making, testing, and building your changes, then opening a pull request. Please try to maintain a uniform code style.

## License
[MIT](https://github.com/joshuaslate/accesscontrol-decorator-extensions/blob/master/LICENSE).
Extension of the accesscontrol library (also [MIT](https://github.com/onury/accesscontrol/blob/master/LICENSE)).