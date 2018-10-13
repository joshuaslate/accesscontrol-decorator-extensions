import { OwnershipDeterminer, RoleDeterminer } from './';

export interface ResourceMetadata {
  ownershipDeterminer: OwnershipDeterminer;
  roleDeterminer?: RoleDeterminer;
};
