import { request } from 'umi';
import React, {
  useEffect,
  useState,
  useMemo,
  cloneElement,
  ReactNode,
  ReactElement,
} from 'react';
import useService from '@/hooks/useService';
import { Space, Input, Form, Button } from 'antd';
import { Table, ColumnsType } from '@/components/Table';
import {
  FormListFieldData,
  FormListOperation,
  FormListProps,
} from 'antd/lib/form/FormList';

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

  return result.data ? (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form onFinish={console.log} initialValues={result.data}>
          <Form.Item name="name" label="name">
            <Input />
          </Form.Item>
          <Form.List name="list">
            {Table.withForm(<Table columns={columns} />)}
          </Form.List>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </>
  ) : null;
}
