import { PlusOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Pagination, Space } from 'antd';
import { FormListProps } from 'antd/lib/form';
import React, { cloneElement, ReactElement } from 'react';
import { NoneData, TableProvider, useTable } from './Cell';
import './index.less';
import { TableProps, TableWithForm, TableWithOutForm } from './propTypes';
import { Row } from './Row';
import { getRowKey, parseNamePath } from './utils';

export function EditableTable<R>(
  props: TableWithForm<R> & TableProps<R>,
): JSX.Element;
export function EditableTable<R>(
  props: TableWithOutForm<R> & TableProps<R>,
): JSX.Element;
export function EditableTable<R>({
  columns = [],
  editable,
  pagination,
  scroll,
  bordered = false,
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
            <Button type="link" onClick={onAddBtnClick}>
              <PlusOutlined /> {addBtn}
            </Button>
          ) : (
            addBtn
          ),
        )
      : null;
  return (
    <TableProvider<R> columns={columns} editable={editable} {...props}>
      <table
        className={`pro-table ${bordered ? 'pro-table-bordered' : ''}`}
        style={{ width: '100%' }}
      >
        <thead>
          <tr>
            {columns.map((column, columnIndex) => (
              <th
                className="pro-table-th"
                key={(column.dataIndex as string) || `thead${columnIndex}`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.length ? content : <NoneData colSpan={columns.length} />}
        </tbody>
        {(pagination || addBtn !== false) && (
          <tfoot>
            <tr>
              <td className="pro-table-cell" colSpan={columns.length}>
                <div className="pro-table-footer">
                  <Space>
                    {renderAddBtn}
                    {errors}
                  </Space>
                  {pagination && content.length ? (
                    <Pagination {...pagination} />
                  ) : null}
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </TableProvider>
  );
}

EditableTable.withForm = (node: ReactElement): FormListProps['children'] => (
  ...formList
) => {
  return cloneElement(node, {
    formList,
  });
};
EditableTable.useTable = useTable;
