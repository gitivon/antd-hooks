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
  classes: Iclass[];
}
interface Iclass {
  name: string;
  time: string;
}
interface IformProps {
  student: Istudent;
  teacher: Teacher;
  classes: Iclass[];
}
const initialState: Partial<IformProps> = {
  classes: [{
    name: '语文',
    time: '2019',
  }, {
    name: '数学',
    time: '2020'
  }],
}
const DemoForm: FC<FormComponentProps<IformProps>> = ({ form }) => {
  const { getFieldDecorator } = form;
  const [formData, setFormData] = useState<IformProps>()
  const [items, { add, remove }] = useDynamicFormItem(initialState.classes);
  const onSubmit = useSubmit<IformProps>(form, setFormData);
  return (
    <>
      <Form style={{ width: 400 }} onSubmit={onSubmit} labelCol={{
        span: 8
      }} wrapperCol={{
        span: 16
      }}>
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
            {getFieldDecorator(`classes[${key}].name`, {
              initialValue: initialState.classes && initialState.classes[key] && initialState.classes[key].name,
              rules: [{ required: true }]
            })(
              <Input />
            )}
            {getFieldDecorator(`classes[${key}].time`, {
              initialValue: initialState.classes && initialState.classes[key] && initialState.classes[key].time,
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
          <Button onClick={add}>增加班级</Button>
        </Form.Item>
      </Form>
      <pre>
        <code>{JSON.stringify(formData)}</code>
      </pre>
    </>
  )
}

const Demo = Form.create()(DemoForm);

storiesOf('Hooks', module)
  .add('useSelectWithObj', () => <Demo />)
