import { FormItemProps } from 'antd';
import { FormInstance, FormListProps, FormProps } from 'antd/lib/form';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import { NamePath } from 'antd/lib/form/interface';
import { Key } from 'react';
import {
  TableCellComponent,
  TableFormItemComponent,
  TableRowComponent,
} from './Tr';

interface FormListMeta {
  errors: React.ReactNode[];
}
export interface TableFormListOperation<R> {
  save: () => void;
  cancel: () => void;
  add: (newRecord?: R, insertIndex?: number) => void;
  remove: () => void;
  move: (form: number, to: number) => void;
}
export interface CellFormItemProps<RecordType = any> {
  field?: FormListFieldData;
  operator?: TableFormListOperation<RecordType>;
  meta?: FormListMeta;
  column: ColumnType<RecordType>;
  form: FormInstance<RecordType>;
  text: any;
  index: number;
  editing: boolean;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  record: RecordType;
}

export type RowKey<R> = string | ((record: R, index: number) => Key);

export interface RowProps<R = any> {
  record: R;
  index: number;
  parentForm?: {
    form: FormInstance<R>;
    name: NamePath;
  };
  columns: ColumnsType<R>;
  editable?: EditableProps<R>;
  formList?: [FormListFieldData, FormListOperation, FormListMeta];
}

export interface ColumnType<RecordType extends Record<string, any>> {
  title: string;
  dataIndex?: keyof RecordType;
  render?: TableFormItemComponent<RecordType>;
  renderFormItem?: TableFormItemComponent<RecordType>;
  formItemProps?: FormItemProps;
}
export type FormSaveHandler<RecordType> = (
  record: RecordType,
  meta: {
    formList?: [FormListFieldData, FormListOperation, FormListMeta];
    form: FormInstance<RecordType>;
  },
) => any;
export type ColumnsType<RecordType> = ColumnType<RecordType>[];
export interface EditableProps<RecordType> {
  formProps?: FormProps<RecordType>;
  onSave?: FormSaveHandler<RecordType>;
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
