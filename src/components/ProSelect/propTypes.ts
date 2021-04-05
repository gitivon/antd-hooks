import { IListService } from '@/hooks/useRequestList';
import { SelectProps } from 'antd';
import { Key, ReactNode } from 'react';

export type RawValueType = string | number;
export interface LabelValueType {
  key?: Key;
  value?: RawValueType;
  label?: React.ReactNode;
  isCacheable?: Boolean;
}
export type DefaultValueType =
  | RawValueType
  | RawValueType[]
  | LabelValueType
  | LabelValueType[];

export type Service = (...args: any[]) => Promise<any>;

export type Label<V> = keyof V | ((item: V) => ReactNode);

export type SingleType<T> = T extends (infer Single)[] ? Single : T;

export interface ProSelectBaseProp<V, I>
  extends Omit<
    SelectProps<keyof V>,
    'defaultValue' | 'value' | 'onChange' | 'onSelect' | 'onDeselect'
  > {
  service: IListService<I, V>;
  label: Label<V>;
  queryBean?: Partial<I>;
  valueKey: keyof V;
}

export interface ProSelectExtractedProp<VT extends DefaultValueType, I>
  extends ProSelectBaseProp<VT, I> {
  extract: true;
  value: VT;
}

export interface ProSelectNotExtractedProp<VT extends DefaultValueType, I>
  extends ProSelectBaseProp<VT, I> {
  extract?: false | undefined;
  value: VT;
}
export type ProSelectProp<V, I> =
  | ProSelectExtractedProp<V, I>
  | ProSelectNotExtractedProp<V, I>;
