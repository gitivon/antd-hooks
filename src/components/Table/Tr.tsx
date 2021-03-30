import React, { PropsWithChildren } from 'react';

export function Tr(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  >,
) {
  return <tr {...props} />;
}

export function Cell({ children }: PropsWithChildren<{}>) {
  return <td>{children}</td>;
}
