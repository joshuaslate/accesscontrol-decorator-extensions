import { Action, Scope } from '../constants';

export type AccessLevel = {
  [action in Action | string]?: Scope | string;
};
