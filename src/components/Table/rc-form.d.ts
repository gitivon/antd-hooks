declare module 'rc-form' {
  import { ComponentType, PropsWithChildren } from 'react';

  export interface InjectFormProps<R> {
    form: RcFormInstance<R>;
  }

  export type WrappedFormComponent<P, R> = ComponentType<
    InjectFormProps<R> & P
  >;

  export function createForm<P = {}, R = any>(
    options?: RcFormOptions,
  ): (WrappedComponent: WrappedFormComponent<P, R>) => ComponentType<P>;

  export interface RcFormInstance<R> {
    getValueProps(): void;
    getFieldDecorator: (name: string, options?: any) => any;
    [k: string]: any;
  }

  export interface RcFormOptions {}
}

// declare module 'rc-form';
