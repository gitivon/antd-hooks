import React, { PropsWithChildren } from 'react';

export function Row({ children, ...props }: PropsWithChildren<{}>) {
  console.log('Row.tsx:4', props, children);
  return <tr>{children}</tr>;
}
