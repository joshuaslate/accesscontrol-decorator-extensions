import { Action } from './constants';
import { getPermission } from './util/getPermission';

export function filterAccess<T>(itemToFilter: T, action: Action, viewer: any): Partial<T> {
  return getPermission<T>(itemToFilter, action, viewer).filter(itemToFilter);
};
