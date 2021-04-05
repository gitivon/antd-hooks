import { Table } from '@/components/Table';
import {
  CellFormItemProps,
  ColumnsType,
  FormSaveHandler,
} from '@/components/Table/propTypes';
import useService from '@/hooks/useService';
import { Button, Form, Input, Space, message } from 'antd';
import React, { useMemo, useState, useCallback } from 'react';
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

const Name = ({ column }: CellFormItemProps<Person>) => {
  return (
    <Form.Item name={column.dataIndex} rules={[{ required: true }]} noStyle>
      <Input />
    </Form.Item>
  );
};

export default function UseService() {
  const [form] = Form.useForm<Person>();
  const [pageNum, setPageNum] = useState('1');
  const result = useService(listPage, [pageNum]);
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
  const onSave: FormSaveHandler<Person> = useCallback(record => {
    message.success('保存成功');
  }, []);

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
                    pagination={{
                      total: 100,
                    }}
                    editable={{
                      newRecord() {
                        return {
                          id: 666,
                        };
                      },
                      onSave,
                    }}
                  />
                  {/* <Form.ErrorList errors={errors} />
                  <Button type="link" onClick={() => add()}>
                    添加一行
                  </Button> */}
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
