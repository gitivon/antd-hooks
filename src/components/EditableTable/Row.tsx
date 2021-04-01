import { Form } from 'antd';
import set from 'lodash.set';
import React, { createElement, useCallback, useState } from 'react';
import './index.less';
import { CellFormItemProps, RowProps, TableCellOperation } from './propTypes';
import { Cell, useTable } from './Cell';
import { parseNamePath } from './utils';

interface TextProps {
  value?: string;
}
export function Text({ value }: TextProps) {
  return <>{value}</>;
}

function RenderTextColumn<R extends Record<string, any>>({
  column,
}: CellFormItemProps<R>) {
  const name = column.dataIndex;
  if (typeof name !== 'string') {
    throw new Error(`${name} 不是合法的 column.dataIndex 类型`);
  }
  return (
    <Form.Item name={name} noStyle>
      <Text />
    </Form.Item>
  );
}

export function Row<R>({
  editable,
  index,
  columns,
  record,
  formList,
  parentForm,
}: RowProps<R>) {
  const [editing, setEditing] = useState(false);
  const { formProps, onSave } = editable ?? {};
  const [form] = Form.useForm<R>(formProps?.form);
  const [expanded, expand] = useState(false);
  const { expandable } = useTable<R>();
  const [field, operator, meta] = formList || [];

  const syncFormValue = useCallback(() => {
    if (parentForm && field) {
      const values: R = form.getFieldsValue(true);
      const parentFormValues: R[] = parentForm.form.getFieldsValue(true);
      const nextValue = set(
        parentFormValues,
        parseNamePath(parentForm.name, field.name),
        values,
      );
      parentForm.form.setFieldsValue(nextValue);
    }
  }, [form, parentForm, field]);

  return (
    <Form initialValues={record} {...formProps} form={form} component={false}>
      <tr>
        {columns.map((column, columnIndex) => {
          // record 可能为空, 新增一行的时候
          const text =
            column.dataIndex && record
              ? ((record[column.dataIndex] as unknown) as string)
              : '';
          const renderItem =
            column.renderFormItem || column.render || RenderTextColumn;
          const cellProps: CellFormItemProps<any> = {
            column,
            text,
            record,
            index,
            form,
            expanded,
            editing,
            setEditing,
          };
          if (operator && field) {
            // 操作项设置
            const tableOperator: TableCellOperation<R> = {
              ...operator,
              add(newRecord, insertIndex) {
                operator.add(newRecord, insertIndex ?? field.name + 1);
              },
              async save() {
                form.submit();
                if (onSave) {
                  const values: R = form.getFieldsValue(true);
                  await onSave(values, {
                    formList,
                    form,
                  });
                  // 同步
                  syncFormValue();
                }
              },
              remove() {
                operator.remove(field.name);
              },
              cancel() {
                form.resetFields();
              },
              expand(nextExpanded) {
                expand(prev => nextExpanded ?? !prev);
              },
            };
            Object.assign(cellProps, {
              operator: tableOperator,
              field,
              meta,
            });
          }
          return (
            <Cell key={(column.dataIndex as string) || columnIndex}>
              {createElement(renderItem, cellProps)}
            </Cell>
          );
        })}
      </tr>
      {expanded && expandable?.expandedRowRender && (
        <tr>
          <td colSpan={columns.length} className="pro-table-cell">
            {createElement(expandable.expandedRowRender, {
              record,
              index,
              parentForm,
              columns,
              formList,
              editable,
              form,
              syncFormValue,
            })}
          </td>
        </tr>
      )}
    </Form>
  );
}
