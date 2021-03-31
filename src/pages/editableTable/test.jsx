import { useWhyDidYouUpdate } from 'ahooks';
import { createForm } from 'rc-form';

const Form = createForm()(({ form }) => {
  console.log('test.jsx:4', 'www');
  useWhyDidYouUpdate('form', { form });
  return <>{form.getFieldDecorator('name')(<input />)}</>;
});

export default () => {
  return <Form></Form>;
};
