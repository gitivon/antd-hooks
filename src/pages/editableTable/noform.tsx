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

  const onSave = (form: any) => {
    const data = form.getFieldsValue();
    console.log('noform.tsx:33', data);
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
        render: ({ text, record, index, form }) => {
          return (
            <Space>
              <Button type="link" onClick={() => onSave(form)}>
                保存
              </Button>
              <Button type="link" onClick={() => onCancel(form)}>
                取消
              </Button>
            </Space>
          );
        },
      },
    ];
  }, []);

  return result.data ? (
    <>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Table columns={columns} dataSource={result.data.list} rowKey="id" />
      </Space>
    </>
  ) : null;
}
