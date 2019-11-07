import { useCallback, useState } from "react";

export const useDynamicFormItem = <T>(initialState: T[] = []) => {
  const [count, setCount] = useState(initialState.length);
  const [items, setItems] = useState<number[]>(Array.from({
    length: initialState.length
  }).map((_, i) => i));
  const add = useCallback(() => {
    setItems(items.concat(count));
    setCount(count + 1);
  }, [items, count]);
  const remove = useCallback((index: number) => {
    const next = items.filter(k => k !== index);
    setItems(next);
  }, [items]);
  return [
    items,
    {
      add,
      remove,
    }
  ] as const;
}