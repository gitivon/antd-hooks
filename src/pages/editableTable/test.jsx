import { useWhyDidYouUpdate } from 'ahooks';
import { createForm } from 'rc-form';
import { Button, Form, Input } from 'antd';
import { useState, useReducer, useEffect, useMemo } from 'react';

const values = {
  a: [
    {
      name: 'a',
      id: 1,
    },
    {
      name: 'b',
      id: 2,
    },
  ],
};

export default () => {
  const App = useMemo(
    () =>
      createForm()(({ form }) => {
        console.log('test.jsx:4', 'www');
        const [, forceUpdate] = useReducer(p => p + 1, 0);
        useWhyDidYouUpdate('form', { form });
        useEffect(() => {
          form.setFieldsInitialValue({
            name: '111',
            age: 99,
          });
          forceUpdate();
        }, []);
        console.log('test.jsx:15', 'render');
        return (
          <>
            {form.getFieldDecorator('name')(<Input />)}
            <Button
              onClick={() => {
                form.setFieldsInitialValue({
                  name: '233',
                });
                form.resetFields();
                forceUpdate();
              }}
            >
              充值
            </Button>
            <Button
              onClick={() => {
                const values = form.getFieldsValue();
                console.log('test.jsx:16', values);
              }}
            >
              提交
            </Button>
            <Button onClick={() => form.resetFields()}>reset</Button>
          </>
        );
      }),
    [],
  );

  return (
    <Form initialValues={values}>
      <Form.List name="a">
        {fields => fields.map(field => <App key={field.key} />)}
      </Form.List>
    </Form>
  );
};
