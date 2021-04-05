import useRequestList, { IListService } from '@/hooks/useRequestList';
import { Select } from 'antd';
import React, { Key } from 'react';
import {
  Label,
  ProSelectExtractedProp,
  ProSelectNotExtractedProp,
  ProSelectProp,
} from './propTypes';

function isKey(key: any): key is Key {
  return typeof key === 'string' || typeof key === 'number';
}

function renderLabel<V>(item: V, label: Label<V>) {
  return typeof label === 'function' ? label(item) : item[label];
}

export function ProSelect<V, I>(
  props: ProSelectExtractedProp<V, I>,
): JSX.Element;
export function ProSelect<V, I>(
  props: ProSelectNotExtractedProp<V, I>,
): JSX.Element;
export function ProSelect<V, I>(props: ProSelectProp<V, I>): JSX.Element {
  const {
    service,
    label,
    valueKey,
    queryBean,
    extract,
    ...selectProps
  } = props;

  const { loading, data = [], ...result } = useRequestList(service, {
    queryBean,
  });
  return (
    <Select loading={loading} {...selectProps}>
      {data.map(item => {
        const key = item[valueKey];
        if (!isKey(key)) {
          throw new Error(`${key} 不是合法的React.Key类型`);
        }
        return (
          <Select.Option key={key} value={key}>
            {renderLabel(item, label)}
          </Select.Option>
        );
      })}
    </Select>
  );
}

export default ProSelect;
