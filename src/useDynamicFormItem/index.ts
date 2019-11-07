import { useCallback, useState } from "react";

export const useDynamicFormItem = <T = any>(initialState: T[] = []) => {
  const [count, setCount] = useState(initialState.length);
  const [items, setItems] = useState<number[]>(Array.from({
    length: initialState.length
  }).map((_, i) => i));
  const addItem = useCallback(() => {
    setItems(items.concat(count));
    setCount(count + 1);
  }, [items, count]);
  const removeItem = useCallback((index: number) => {
    const next = items.filter(k => k !== index);
    setItems(next);
  }, [items]);
  return [
    items,
    addItem,
    removeItem,
  ] as [number[], () => void, (index: number) => void]
}