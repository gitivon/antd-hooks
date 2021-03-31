import { Table } from '@/components/Table';
import { CellFormItemProps, ColumnsType } from '@/components/Table/propTypes';
import useService from '@/hooks/useService';
import { Button, Form, Input, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import { request } from 'umi';

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
  return request<Res<Person>>('/api/listPage', {
    params: {
      pageNum,
      pageSize,
    },
  });
};

const Name = ({ form, text, column }: CellFormItemProps<Person>) => {
  return form.getFieldDecorator(column.dataIndex, {
    initialValue: text,
    rules: [{ required: true }],
  })(<Input />);
};

export default function UseService() {
  const [pageNum, setPageNum] = useState('1');
  const result = useService(listPage, [pageNum]);

  const onSave = (record: Person) => {
    console.log('form.tsx:39', record);
  };
  const onCancel = (form: any) => {
    form.resetFields();
  };

  const columns: ColumnsType<Person> = useMemo(() => {
    return [
      {
        title: 'id',
        dataIndex: 'id',
        editable: {},
      },
      {
        title: '姓名',
        dataIndex: 'name',
        renderFormItem: Name,
      },
      {
        title: '操作',
        render: ({ index, operator }) => {
          return (
            <Space split={'|'} size={0}>
              {operator && (
                <>
                  <Button type="link" onClick={() => operator.add()}>
                    添加一行
                  </Button>
                  <Button type="link" onClick={operator.save}>
                    保存
                  </Button>
                  <Button type="link" onClick={operator.cancel}>
                    取消
                  </Button>
                  <Button
                    type="link"
                    onClick={() => operator.move(index, index - 1)}
                  >
                    上移
                  </Button>
                  <Button
                    type="link"
                    onClick={() => operator.move(index, index + 1)}
                  >
                    下移
                  </Button>
                  <Button type="link" onClick={operator.remove}>
                    删除
                  </Button>
                </>
              )}
            </Space>
          );
        },
      },
    ];
  }, []);

  const [form] = Form.useForm();
  return result.data ? (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form onFinish={console.log} form={form} initialValues={result.data}>
          <Form.Item name="name" label="name">
            <Input />
          </Form.Item>
          <Form.List
            name="list"
            rules={[
              {
                validator: async (_, items) => {
                  if (items.includes(undefined)) {
                    throw new Error('请先保存');
                  }
                },
              },
            ]}
          >
            {(...formList) => {
              const [, { add }, { errors }] = formList;
              return (
                <>
                  <Table
                    form={form}
                    name="list"
                    columns={columns}
                    formList={formList}
                    editable={{
                      onSave,
                    }}
                  />
                  <Form.ErrorList errors={errors} />
                  <Button type="link" onClick={() => add()}>
                    添加一行
                  </Button>
                </>
              );
            }}
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
