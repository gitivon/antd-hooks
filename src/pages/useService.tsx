import { request } from 'umi';
import React, { useEffect, useState, useMemo } from 'react';
import useService from '@/hooks/useService';
import { Space, Input } from 'antd';
import { Table, ColumnsType } from '@/components/Table';

interface Person {
  id: number;
  name: string;
}
interface Res<T> {
  data: {
    list: T[];
    total: number;
  };
}
const listPage = (pageNum?: string, pageSize?: string) => {
  console.log('useService.tsx:9', pageNum);
  return request<Res<Person>>('/api/listPage', {
    params: {
      pageNum,
      pageSize,
    },
  });
};

export default function UseService() {
  const [pageNum, setPageNum] = useState('1');
  const result = useService(listPage, [pageNum]);
  console.log('useService.tsx:11', result);

  const columns: ColumnsType<Person> = useMemo(() => {
    return [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
    ];
  }, []);

  return (
    <>
      <Space direction="vertical">
        <Input value={pageNum} onChange={e => setPageNum(e.target.value)} />
        <Table columns={columns} dataSource={result.data?.list} />
      </Space>
    </>
  );
}
