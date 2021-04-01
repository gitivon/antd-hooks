import { FormListProps } from 'antd/lib/form';
import { NamePath } from 'antd/lib/form/interface';
import set from 'lodash.set';
import React, {
  cloneElement,
  createElement,
  ReactElement,
  useState,
} from 'react';
import {
  CellFormItemProps,
  RowProps,
  TableFormListOperation,
  TableProps,
  TableWithForm,
  TableWithOutForm,
} from './propTypes';
import { Cell, getRowKey } from './Tr';
import { Space, Pagination, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './index.less';

const parseNamePath = (name1: NamePath, name2: number): NamePath => {
  if (Array.isArray(name1)) {
    return [...name1, name2];
  } else {
    return [name1, name2];
  }
};

function Row<R>({
  editable,
  index,
  columns,
  record,
  formList,
  parentForm,
}: RowProps<R>) {
  const [editing, setEditable] = useState(false);
  const { formProps, onSave } = editable ?? {};
  const [form] = Form.useForm<R>(formProps?.form);
  return (
    <tr>
      <Form initialValues={record} {...formProps} form={form} component={false}>
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
            editing,
            setEditable,
          };
          if (operator && field) {
            // 操作项设置
            const tableOperator: TableFormListOperation<R> = {
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
                  if (parentForm) {
                    const parentFormValues: R[] = parentForm.form.getFieldsValue(
                      true,
                    );
                    const nextValue = set(
                      parentFormValues,
                      parseNamePath(parentForm.name, field.name),
                      values,
                    );
                    parentForm.form.setFieldsValue(nextValue);
                  }
                }
              },
              remove() {
                operator.remove(field.name);
              },
              cancel() {
                form.resetFields();
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
              {renderItem ? createElement(renderItem, cellProps) : text}
            </Cell>
          );
        })}
      </Form>
    </tr>
  );
}

export function Table<R>(props: TableWithForm<R> & TableProps<R>): JSX.Element;
export function Table<R>(
  props: TableWithOutForm<R> & TableProps<R>,
): JSX.Element;
export function Table<R>({
  columns = [],
  editable,
  pagination,
  ...props
}: (TableWithForm<R> | TableWithOutForm<R>) & TableProps<R>) {
  let content;
  let errors = null;
  let onAddBtnClick;
  const { addBtn = '添加一行', newRecord } = editable || {};
  // 含表单
  if ('formList' in props) {
    const { formList, form, name } = props;
    const [fields, operator, meta] = formList;
    onAddBtnClick = () => {
      operator.add(newRecord?.());
    };
    content = fields.map((field, rowIndex) => {
      const record = form.getFieldValue(parseNamePath(name, field.name));
      return (
        <Row
          editable={editable}
          index={rowIndex}
          key={field.key}
          columns={columns}
          record={record}
          parentForm={{ form, name }}
          formList={[field, operator, meta]}
        />
      );
    });
    errors = <Form.ErrorList errors={meta.errors} />;
  } else {
    // 不含表单
    const { dataSource = [] } = props;
    content = dataSource.map((record, index) => {
      const key = getRowKey(record, props.rowKey, index);
      return (
        <Row
          key={key}
          editable={editable}
          columns={columns}
          record={record}
          index={index}
        />
      );
    });
  }
  const renderAddBtn =
    addBtn !== false
      ? cloneElement(
          typeof addBtn === 'string' ? (
            <Button type="link">
              <PlusOutlined /> {addBtn}
            </Button>
          ) : (
            addBtn
          ),
          {
            onClick: onAddBtnClick,
          },
        )
      : null;
  return (
    <table className="pro-table" style={{ width: '100%' }}>
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
      {pagination && addBtn !== false && (
        <tfoot>
          <tr>
            <td
              colSpan={columns.length}
              style={{
                padding: 15,
              }}
            >
              <div className="pro-table-footer">
                <Space>
                  {renderAddBtn}
                  {errors}
                </Space>
                {pagination && <Pagination {...pagination} />}
              </div>
            </td>
          </tr>
        </tfoot>
      )}
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
