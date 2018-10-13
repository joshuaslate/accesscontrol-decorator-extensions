import { AccessLevel } from './AccessLevel';

export type Permissions = {
  [role: string]: AccessLevel;
};
