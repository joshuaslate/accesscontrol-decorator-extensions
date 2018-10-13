export interface OwnershipDeterminer {
  (viewer: any, target: any): boolean;
};
