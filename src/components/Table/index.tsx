import { Form, Input } from 'antd';
import { FormListProps } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';
import { createForm } from 'rc-form';
import React, {
  cloneElement,
  createElement,
  ReactElement,
  useState,
} from 'react';
import {
  CellFormItemProps,
  RowProps,
  TableProps,
  TableWithForm,
  TableWithOutForm,
} from './propTypes';
import { Cell, getRowKey } from './Tr';

const parseNamePath = (name1: NamePath, name2: number): NamePath => {
  if (Array.isArray(name1)) {
    return [...name1, name2];
  } else {
    return [name1, name2];
  }
};

const Row = createForm<RowProps>()(
  ({ form, index, columns, record, formList }) => {
    const [editable, setEditable] = useState(false);
    return (
      <tr>
        {columns.map((column, columnIndex) => {
          // record 可能为空, 新增一行的时候
          const text =
            column.dataIndex && record
              ? ((record[column.dataIndex] as unknown) as string)
              : '';
          const renderItem = column.renderFormItem || column.render;
          const [field, operator, meta] = formList || [];
          const cellProps: CellFormItemProps<any> = {
            column,
            text,
            record,
            index,
            form,
            editable,
            setEditable,
          };
          if (operator) {
            // 操作项设置
            const tableOperator = {
              ...operator,
              save() {
                console.log('index.tsx:34', form);
              },
              cancel() {},
            };
            Object.assign(cellProps, {
              operator: tableOperator,
              field,
              meta,
            });
          }
          return (
            <Cell key={(column.dataIndex as string) || columnIndex}>
              {renderItem ? createElement(renderItem, cellProps) : text}
            </Cell>
          );
        })}
      </tr>
    );
  },
);

export function Table<R>(props: TableWithForm<R> & TableProps<R>): JSX.Element;
export function Table<R>(
  props: TableWithOutForm<R> & TableProps<R>,
): JSX.Element;
export function Table<R>({
  columns = [],
  ...props
}: (TableWithForm<R> | TableWithOutForm<R>) & TableProps<R>) {
  let content;
  // 含表单
  if ('formList' in props) {
    const { formList, form, name } = props;
    const [fields, operator, meta] = formList;
    content = fields.map((field, rowIndex) => {
      const record = form.getFieldValue(parseNamePath(name, field.name));
      return (
        <Row
          index={rowIndex}
          key={field.key}
          columns={columns}
          record={record}
          formList={[field, operator, meta]}
        />
      );
    });
  } else {
    // 不含表单
    const { dataSource = [] } = props;
    content = dataSource.map((record, index) => {
      const key = getRowKey(record, props.rowKey, index);
      return <Row key={key} columns={columns} record={record} index={index} />;
    });
  }
  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          {columns.map((column, columnIndex) => (
            <th key={(column.dataIndex as string) || `thead${columnIndex}`}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{content}</tbody>
    </table>
  );
}

Table.withForm = (node: ReactElement): FormListProps['children'] => (
  ...formList
) => {
  return cloneElement(node, {
    formList,
  });
};
