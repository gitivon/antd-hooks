import React, {
  cloneElement,
  FC,
  Key,
  PropsWithChildren,
  ReactElement,
} from 'react';
import { Space, Input, Form, Button } from 'antd';
import { Cell } from './Tr';
import { FormItemProps } from 'antd';
import { FormListProps } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';

export interface ColumnType<RecordType extends Record<string, any>> {
  title: string;
  dataIndex: keyof RecordType;
  render?: () => JSX.Element;
  formItemProps?: FormItemProps;
}
export type ColumnsType<RecordType> = ColumnType<RecordType>[];
export interface EditableProps<RecordType> {
  rowKey: (record: RecordType) => Key;
}
export interface TableProps<RecordType> {
  dataSource?: RecordType[];
  columns?: ColumnsType<RecordType>;
  editable?: EditableProps<RecordType>;
  formList?: Parameters<FormListProps['children']>;
}

export function Table<RecordType>({
  columns = [],
  dataSource = [],
  formList,
  ...props
}: PropsWithChildren<TableProps<RecordType>>) {
  let content;
  let tfoot;
  if (formList) {
    const [fields, operator, meta] = formList;
    tfoot = (
      <tr>
        <td colSpan={columns.length}>
          <Button type="link" onClick={() => operator.add()}>
            添加一行
          </Button>
        </td>
      </tr>
    );
    content = fields.map(field => {
      return (
        <tr key={field.key}>
          {columns.map(column => {
            const name: NamePath = [field.name, column.dataIndex.toString()];
            return (
              <Cell key={column.dataIndex as string}>
                <Form.Item name={name}>
                  <Input />
                </Form.Item>
              </Cell>
            );
          })}
        </tr>
      );
    });
  } else {
    content = dataSource.map((record, index) => {
      return (
        <tr key={index}>
          {columns.map(column => {
            return (
              <Cell key={column.dataIndex as string}>
                {record[column.dataIndex]}
              </Cell>
            );
          })}
        </tr>
      );
    });
  }
  return (
    <>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.dataIndex as string}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>{content}</tbody>
        <tfoot>{tfoot}</tfoot>
      </table>
    </>
  );
}

Table.withForm = (node: ReactElement): FormListProps['children'] => (
  ...formList
) => {
  return cloneElement(node, {
    formList,
  });
};
