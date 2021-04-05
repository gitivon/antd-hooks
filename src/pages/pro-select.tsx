import { request } from 'umi';
import React from 'react';
import { ProSelect } from '../components/ProSelect';
import { IListService } from '@/hooks/useRequestList';
import { Form, Input, Button } from 'antd';

const queryListPage: IListService<Person, Person> = params =>
  request('/api/listPage', {
    params,
  });

export default function App() {
  const [form] = Form.useForm<Person>();
  return (
    <>
      <Form form={form} onFinish={console.log}>
        <Form.Item name="name" label="name">
          <Input />
        </Form.Item>
        <Form.Item label="学生列表" shouldUpdate>
          {({ getFieldValue }) => (
            <Form.Item name="person" noStyle>
              <ProSelect
                style={{
                  width: 100,
                }}
                service={queryListPage}
                valueKey="id"
                queryBean={{
                  name: getFieldValue('name'),
                }}
                label={person => (
                  <>
                    {person.id}_{person.name}
                  </>
                )}
              />
            </Form.Item>
          )}
        </Form.Item>
        <Button htmlType="submit">submit</Button>
      </Form>
    </>
  );
}

const foo = () =>
  queryListPage({
    pageNum: 1,
    pageSize: 10,
    queryBean: {
      name: '3',
      id: 1,
    },
  });
