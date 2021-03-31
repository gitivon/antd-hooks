import React, { ComponentType, Key } from 'react';
import { CellFormItemProps, RowKey, RowProps } from './propTypes';

interface CellProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > {}
export type TableRowComponent<R> = ComponentType<RowProps<R>>;
export type TableCellComponent = ComponentType<CellProps>;
export type TableFormItemComponent<R> = ComponentType<CellFormItemProps<R>>;

export const Cell: TableCellComponent = ({ children }) => {
  return (
    <td
      style={{
        padding: 15,
        borderBottom: '1px solid #ccc',
      }}
    >
      {children}
    </td>
  );
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
