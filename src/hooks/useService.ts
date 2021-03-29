import { useRequest } from 'umi';
import { useEffect } from 'react';
import isEqual from 'fast-deep-equal';
import { usePrevious } from 'ahooks';

interface IService<I extends any[], O> {
  (...args: I): Promise<O>;
}

export default function useService<I extends any[], O>(
  service: IService<I, O>,
  params: Parameters<typeof service>,
  serviceOption?: Parameters<typeof useRequest>[1],
) {
  const prevParams = usePrevious(params);
  const result = useRequest(service, {
    defaultParams: params,
  });
  const { run } = result;
  useEffect(() => {
    if (prevParams && !isEqual(prevParams, params)) {
      run(...params);
    }
  });
  return {
    ...result,
  };
}
