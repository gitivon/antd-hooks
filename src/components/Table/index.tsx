import React, { FC, PropsWithChildren } from 'react';
import { FormItemProps } from 'antd';

export interface ColumnType<RecordType extends Record<string, any>> {
  title: string;
  dataIndex: keyof RecordType;
  render?: () => JSX.Element;
  formItemProps?: FormItemProps;
}
export type ColumnsType<RecordType> = ColumnType<RecordType>[];
export interface TableProps<RecordType> {
  dataSource?: RecordType[];
  columns?: ColumnsType<RecordType>;
}

export function Table<RecordType>({
  columns = [],
  dataSource = [],
  ...props
}: PropsWithChildren<TableProps<RecordType>>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(column => (
            <th key={column.dataIndex as string}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource.map((record, index) => (
          <tr key={index}>
            {columns.map(column => {
              return (
                <td key={column.dataIndex as string}>
                  {record[column.dataIndex]}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
