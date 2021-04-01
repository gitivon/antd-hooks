import { Empty } from 'antd';
import React, {
  ComponentType,
  createContext,
  PropsWithChildren,
  useContext,
} from 'react';
import { CellFormItemProps, RowProps, TableContextProps } from './propTypes';

interface CellProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableCellElement>,
    HTMLTableCellElement
  > {}
export type TableRowComponent<R> = ComponentType<RowProps<R>>;
export type TableCellComponent = ComponentType<CellProps>;
export type TableFormItemComponent<R> = ComponentType<CellFormItemProps<R>>;

export const Cell: TableCellComponent = ({ children }) => {
  return <td className="pro-table-cell">{children}</td>;
};
const TableContext = createContext<TableContextProps<any> | undefined>(
  undefined,
);

export function TableProvider<R>({
  children,
  ...props
}: PropsWithChildren<TableContextProps<R>>) {
  return (
    <TableContext.Provider value={props}>{children}</TableContext.Provider>
  );
}
export function useTable<R>() {
  const ctx = useContext<TableContextProps<R> | undefined>(TableContext);
  if (!ctx) {
    throw new Error('TableContext not found');
  }
  return ctx;
}

export function NoneData(
  props: React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableDataCellElement>,
    HTMLTableDataCellElement
  >,
) {
  return (
    <tr className="pro-table-row">
      <td className="pro-table-cell" {...props}>
        <div className="pro-table-empty">
          {Empty.PRESENTED_IMAGE_SIMPLE}
          <div>暂无数据</div>
        </div>
      </td>
    </tr>
  );
}
