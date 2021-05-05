import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table';
import { request, useRequest } from 'umi';
import type { UserModel } from './models/user';

interface BaseRes<T> {
  data: T;
}
type ListRes<T> = BaseRes<{
  list: T[];
  total: number;
}>;

const getUsers = () =>
  request<ListRes<UserModel>>('/api/users', {
    method: 'GET',
  });

export default function Users() {
  const users = useRequest(getUsers);

  const columns: ColumnsType<UserModel> = [
    { title: 'id', dataIndex: 'id' },
    { title: '姓名', dataIndex: 'name' },
  ];

  return (
    <>
      users:
      <Table
        loading={users.loading}
        rowKey="id"
        columns={columns}
        dataSource={users.data?.list}
      />
    </>
  );
}
