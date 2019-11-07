import { storiesOf } from '@storybook/react';
import { Button, Form, Icon, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import React, { FC, forwardRef, useState } from 'react';
import { useDynamicFormItem } from '../useDynamicFormItem';
import { useSelectWithObj } from '../useSelectWithObj';
import useSubmit from '../useSubmit';

enum Gender {
  Male,
  Female,
}
interface Istudent {
  name: string;
  age: number;
  gender: Gender;
  id: number;
}
const students: Istudent[] = [
  {
    name: '张三',
    age: 18,
    gender: Gender.Male,
    id: 1,
  },
  {
    name: '李四',
    age: 17,
    gender: Gender.Male,
    id: 2,
  },
  {
    name: '小花',
    age: 17,
    gender: Gender.Female,
    id: 3,
  }
]

const StudentSelect: FC = forwardRef<any, any>((props, ref) => {
  const prop = useSelectWithObj(props, students, 'id')
  return (
    <Select {...prop} ref={ref} style={{ width: 100 }}>
      {students.map(stu => (
        <Select.Option key={stu.id} value={stu.id}>
          {stu.name}
        </Select.Option>
      ))}
    </Select>
  )
})

interface Teacher {
  name: string;
  classes: number[];
}
interface IformProps {
  student: Istudent;
  teacher: Teacher;
  classes: number[];
}
const initialState = {
  classes: ['一', '二'],
}
const DemoForm: FC<FormComponentProps<IformProps>> = ({ form }) => {
  const { getFieldDecorator } = form;
  const [formData, setFormData] = useState<IformProps>()
  const [items, addClass, remove] = useDynamicFormItem(initialState.classes);
  const onSubmit = useSubmit<IformProps>(form, setFormData);
  return (
    <>
      <Form onSubmit={onSubmit}>
        <Form.Item label="学生">
          {getFieldDecorator('student')(
            <StudentSelect />
          )}
        </Form.Item>
        <Form.Item label="teacher.name">
          {getFieldDecorator('teacher.name', {
          })(
            <Input />
          )}
        </Form.Item>
        {items.map((key) =>
          <Form.Item label="classes" key={key}>
            {getFieldDecorator(`classes[${key}]`, {
              initialValue: initialState.classes[key],
              rules: [{ required: true }]
            })(
              <Input />
            )}
            <Icon
              type="minus-circle-o"
              onClick={() => remove(key)}
            />
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={addClass}>增加班级</Button>
        </Form.Item>
      </Form>
      <pre>
        <code>{JSON.stringify(formData)}</code>
        <code>{JSON.stringify(items)}</code>
      </pre>
    </>
  )
}

const Demo = Form.create()(DemoForm);

storiesOf('State', module)
  .add('useSelectWithObj', () => <Demo />)
