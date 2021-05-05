import { Form, Input } from 'antd';
import { useRequest, useRouteMatch } from 'umi';
import { UserModel } from './models/user';

interface UserDetailRouteParams {
  id?: string;
}

function UserDetail() {
  const match = useRouteMatch<UserDetailRouteParams>();
  const { id } = match.params;
  const user = useRequest(() => UserModel.getUserById(Number(id)), {
    refreshDeps: [id],
  });
  console.log('[id].tsx:22', user);
  return user.data ? (
    <Form layout="inline" initialValues={user.data}>
      <Form.Item label="姓名" name="name">
        <Input />
      </Form.Item>
    </Form>
  ) : null;
}

export default UserDetail;
