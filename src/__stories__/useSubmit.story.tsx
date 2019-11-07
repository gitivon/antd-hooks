import { storiesOf } from '@storybook/react';
import { Button } from 'antd';
import React, { FC } from 'react';

export const Demo: FC = () => {
  // const [counter] = useSubmit();
  return (
    <>
      <Button type="primary">点我</Button>
    </>
  )
}

storiesOf('State|useSubmit', module)
  .add('Demo', () => <Demo />)
