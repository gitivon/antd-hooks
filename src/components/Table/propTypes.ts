import { FormItemProps } from 'antd';
import { FormInstance, FormListProps } from 'antd/lib/form';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import { NamePath } from 'antd/lib/form/interface';
import { RcFormInstance, RcFormOptions } from 'rc-form';
import { Key, ReactNode } from 'react';
import {
  TableCellComponent,
  TableFormItemComponent,
  TableRowComponent,
} from './Tr';

interface FormListMeta {
  errors: React.ReactNode[];
}
interface TableFormListOperation<R> {
  save: () => void;
  cancel: () => void;
  add: (item: R, insertIndex: number) => void;
  remove: () => void;
  move: (form: number, to: number) => void;
}
export interface CellFormItemProps<RecordType = any> {
  field?: FormListFieldData;
  operator?: TableFormListOperation<RecordType>;
  meta?: FormListMeta;
  column: ColumnType<RecordType>;
  form: RcFormInstance<RecordType>;
  text: any;
  index: number;
  editable: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  record: RecordType;
}

export type RowKey<R> = string | ((record: R, index: number) => Key);

export interface RowProps<R = any> {
  record: R;
  index: number;
  columns: ColumnsType<R>;
  formList?: [FormListFieldData, FormListOperation, FormListMeta];
}

export interface ColumnType<RecordType extends Record<string, any>> {
  title: string;
  dataIndex?: keyof RecordType;
  render?: TableFormItemComponent<RecordType>;
  renderFormItem?: TableFormItemComponent<RecordType>;
  formItemProps?: FormItemProps;
}
export type ColumnsType<RecordType> = ColumnType<RecordType>[];
export interface EditableProps<RecordType> {
  onSave?: (record: RecordType, form: FormInstance<RecordType>) => any;
  rowKey?: (record: RecordType) => Key;
  // formProps: RcFormOptions;
}
export interface TableProps<RecordType> {
  columns?: ColumnsType<RecordType>;
  editable?: EditableProps<RecordType>;
  components?: {
    row: TableRowComponent<RecordType>;
    cell: TableCellComponent;
  };
}

export interface TableWithForm<R> {
  form: FormInstance<R>;
  name: NamePath;
  formList: Parameters<FormListProps['children']>;
}
export interface TableWithOutForm<R> {
  rowKey: RowKey<R>;
  dataSource: R[];
}
