import React, { FC } from 'react';
import { storiesOf } from '@storybook/react';
import useSubmit from '../useSubmit';
import { Button } from 'antd';

interface DemoProp {
  
}
export const Demo: FC<DemoProp> = () => {
  const [counter, setCounter] = useSubmit();
  return (
    <>
      {counter}
      <Button type="primary">点我</Button>
    </>
  )
}

storiesOf('State|useSubmit', module)
  .add('Demo', () => <Demo />)
