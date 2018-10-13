import { Permissions, ResourceMetadata } from './';

export interface ResourceAuthorizationOptions extends ResourceMetadata {
  permissions?: Permissions;
};
