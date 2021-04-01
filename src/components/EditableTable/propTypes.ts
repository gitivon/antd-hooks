import { FormItemProps, PaginationProps } from 'antd';
import { ScrollNumberProps } from 'antd/lib/badge';
import { FormInstance, FormListProps, FormProps } from 'antd/lib/form';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import { NamePath } from 'antd/lib/form/interface';
import { ComponentType, Key, ReactElement, ReactNode } from 'react';
import {
  TableCellComponent,
  TableFormItemComponent,
  TableRowComponent,
} from './Cell';

interface FormListMeta {
  errors: React.ReactNode[];
}
export interface TableCellOperation<R> {
  save: () => void;
  cancel: () => void;
  add: (newRecord?: R, insertIndex?: number) => void;
  remove: () => void;
  move: (form: number, to: number) => void;
  expand: (expanded?: boolean) => void;
}
export interface CellFormItemProps<RecordType = any> {
  field?: FormListFieldData;
  operator?: TableCellOperation<RecordType>;
  meta?: FormListMeta;
  column: ColumnType<RecordType>;
  form: FormInstance<RecordType>;
  text: any;
  index: number;
  expanded: boolean;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
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
  width?: number;
}
export type FormSaveHandler<RecordType> = (
  record: RecordType,
  meta: {
    formList?: [FormListFieldData, FormListOperation, FormListMeta];
    form: FormInstance<RecordType>;
  },
) => any;
export type ColumnsType<RecordType> = ColumnType<RecordType>[];
export type EditableProps<RecordType> = Partial<{
  formProps?: FormProps<RecordType>;
  newRecord?: () => Partial<RecordType>;
  addBtn?: ReactElement | false | string;
  onSave?: FormSaveHandler<RecordType>;
  rowKey?: (record: RecordType) => Key;
  // formProps: RcFormOptions;
}>;

export interface ExpandedRowProps<R> extends RowProps<R> {
  form: FormInstance<R>;
  syncFormValue: () => void;
}
interface ExpandableProps<R> {
  expandedRowKeys: Key[];
  expandedRowRender: ComponentType<ExpandedRowProps<R>>;
  expandIcon: ComponentType;
  onExpand: (expanded: boolean, record: R) => void;
}

interface ScrollProps {
  scrollToFirstRowOnChange?: boolean;
  x?: true | 'max-content' | string | number;
  y?: string | number;
}

// table基本属性
export interface TableProps<RecordType> {
  columns?: ColumnsType<RecordType>;
  bordered?: boolean;
  scroll?: ScrollProps;
  editable?: EditableProps<RecordType>;
  pagination?: PaginationProps | false;
  expandable?: Partial<ExpandableProps<RecordType>>;
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

export interface TableContextProps<R> extends TableProps<R> {}

export type TableExpandedRowFC<R, P> = ComponentType<ExpandedRowProps<R> & P>;
