import { useState, useEffect, useCallback } from "react";
import { SelectProps, SelectValue } from "antd/lib/select";

type Omit<T, K extends string | number | symbol> = {
  [P in Exclude<keyof T, K>]: T[P];
};
export type SelectWithObj<T> = Omit<
  SelectProps,
  "defaultValue" | "value" | "onChange"
> & {
  value?: T;
  onChange?: (value: T) => void;
};

export function useSelectWithObj<T>(
  props: SelectWithObj<T>,
  list: T[],
  uniqKey: keyof T
): SelectProps {
  const { value, onChange, ...prop } = props;
  const [id, setId] = useState<any>();
  const getValue = useCallback(
    (list: T[], id: any) => {
      return list.filter(item => {
        return item[uniqKey] === id;
      });
    },
    [uniqKey]
  );
  useEffect(() => {
    if (value) {
      setId(value[uniqKey]);
      const data = getValue(list, value[uniqKey]);
      if (data.length) {
        onChange && onChange(data[0]);
      }
    }
  }, [value, list, uniqKey, onChange, getValue]);
  const changeHandle = useCallback(
    (v: SelectValue) => {
      setId(v);
      const data = getValue(list, v);
      if (data.length) {
        onChange && onChange(data[0]);
      }
    },
    [list, onChange, getValue]
  );
  return {
    ...prop,
    value: id,
    onChange: changeHandle
  };
}
