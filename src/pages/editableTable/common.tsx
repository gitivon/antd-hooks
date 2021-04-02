import React from 'react';
import { Form, Input, Table } from 'antd';
import { Row } from './Row';

const initialValues = {
  title: '三年二班',
  students: [
    {
      id: 1,
      name: '张三',
    },
    {
      id: 2,
      name: '张三',
    },
  ],
};

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
  },
  {
    title: '姓名',
    dataIndex: 'name',
  },
];

export default () => {
  const [form] = Form.useForm();
  return (
    <Form form={form} initialValues={initialValues}>
      <Form.Item name="title" label="标题">
        <Input />
      </Form.Item>
      <Form.List name="students">
        {(fields, { add }) => {
          const dataSource = form.getFieldValue('students');
          console.log('common.tsx:28', dataSource);
          return (
            <>
              <Table
                components={{
                  body: {
                    row: Row,
                  },
                }}
                rowKey="id"
                columns={columns}
                dataSource={dataSource}
              />
            </>
          );
        }}
      </Form.List>
    </Form>
  );
};
