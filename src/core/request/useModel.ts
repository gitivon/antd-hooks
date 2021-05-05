import { useRequest } from 'umi';

type BaseOption = Parameters<typeof useRequest>;

export const useModel = <F extends (...args: any[]) => any>(
  method: F,
  params: Parameters<typeof method> = [] as any,
  options: BaseOption[1],
) => {
  const res = useRequest(() => method(...params), {
    ...options,
    refreshDeps: params,
  });
  return res;
};
