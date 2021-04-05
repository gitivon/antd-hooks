import { usePrevious, useWhyDidYouUpdate } from 'ahooks';
import isEqual from 'fast-deep-equal';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRequest } from 'umi';

interface PaginationProp {
  pageNum: number;
  pageSize: number;
}
interface IRes<T = any> {
  data: T; // response data
  status: number; // code for errorType
  message: string; // message display to user
}
interface PaginationProp {
  pageNum: number;
  pageSize: number;
}
interface IListReq<T = any> extends PaginationProp {
  queryBean?: Partial<T>;
  [key: string]: any;
}
type IResList<T> = IRes<IListProp<T>>;
export interface IListService<Req, Res> {
  (params?: IListReq<Req>): Promise<IResList<Res>>;
}
interface IListProp<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  list: T[];
}

export interface RequestListOptions<T> {
  rowKey?: string;
  queryBean?: Partial<T>; // 无法通过搜索表单设置的值,此值变更时也会重新发起请求,重置表单不会被清空
  page?: PaginationProp;
  onPageChange?: (page: PaginationProp) => any;
}

const defaultPage = {
  pageNum: 1,
  pageSize: 10,
};
const useDefaultOptions = <I>(options?: RequestListOptions<I>) => {
  const [page, onPageChange] = useState(defaultPage);
  return {
    rowKey: 'id',
    ...options,
    page: options?.page || page,
    onPageChange: options?.onPageChange || onPageChange,
  };
};

// TODO: 应该暴露出 onParamChange方法
export default function useRequestList<
  I,
  R extends Record<string, any>,
  S extends IListService<I, R>
>(
  service: IListService<I, R>,
  options?: RequestListOptions<I>,
  useRequestOptions?: Parameters<typeof useRequest>[1],
) {
  // const [state, setState] = useControllableValue(props, {
  //   defaultValue: '',
  // });
  const [selectedRecords, setSelectedRecords] = useState<R[]>([]);
  const { page, rowKey, onPageChange, queryBean } = useDefaultOptions(options);
  // 搜索表单里的值
  const [searchValues, setSearchValues] = useState<I>();
  // 当次执行service的请求,包括page参数
  const params = useMemo(() => {
    const _queryBean = {
      ...queryBean,
      ...searchValues,
    };
    return {
      ...page,
      queryBean: _queryBean ?? {},
    };
  }, [queryBean, page, searchValues]);
  // 调接口
  const result = useRequest(service, {
    ...useRequestOptions,
    // @ts-ignore
    defaultParams: [params],
  });
  const { data, run } = result;
  // 搜索条件变化时触发
  const prevParams = usePrevious(params);
  const prevSearchValues = usePrevious(searchValues);
  useEffect(() => {
    if (prevParams && !isEqual(prevParams, params)) {
      setSelectedRecords([]); // 修改查询条件的时候需要删除之前的选择条目
      run(params);
    }
  });
  // 分页变更
  const onChange = useCallback(
    (current: number, pageSize: number) => {
      onPageChange({
        pageNum: current,
        pageSize,
      });
    },
    [onPageChange],
  );
  const onSearch = useCallback(
    (values: I) => {
      if (!isEqual(prevSearchValues, values)) {
        setSearchValues(p => ({ ...p, ...values }));
        onChange(defaultPage.pageNum, defaultPage.pageSize);
      }
    },
    [onChange, prevSearchValues],
  );
  // 重置查询条件
  const onReset = useCallback(() => {
    setSearchValues(undefined);
    onChange(defaultPage.pageNum, defaultPage.pageSize);
  }, [onChange]);
  const selectedRowKeys = useMemo(() => {
    return selectedRecords.map(record => record[rowKey]);
  }, [selectedRecords, rowKey]);
  useWhyDidYouUpdate('useRequestList', { searchValues, page });
  return {
    ...result,
    data: result.data?.list as R[],
    onReset,
    onSearch,
    params,
    rowSelection: {
      onChange(selectedRowKeys: string[], rows: R[]) {
        setSelectedRecords(rows);
      },
      type: 'checkbox',
      selectedRowKeys,
    },
    selectedRecords,
    pagination: {
      current: page.pageNum,
      pageSize: page.pageSize,
      onPaginationChange: true,
      total: data?.total,
      onChange,
    },
  };
}
