import { NamePath } from 'rc-field-form/lib/interface';
import { Key } from 'react';
import { RowKey } from './propTypes';

export const parseNamePath = (name1: NamePath, name2: number): NamePath => {
  if (Array.isArray(name1)) {
    return [...name1, name2];
  } else {
    return [name1, name2];
  }
};

export const getRowKey = <R extends Record<string, any>>(
  record: R,
  rowKey: RowKey<R>,
  index: number,
): Key => {
  if (typeof rowKey === 'string') {
    const key = record[rowKey];
    if (typeof key === 'string' || typeof key === 'number') return key;
  } else {
    return rowKey(record, index);
  }
  return index;
};
