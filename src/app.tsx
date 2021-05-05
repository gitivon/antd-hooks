import type { RequestConfig } from 'umi';
import 'reflect-metadata';

export const request: RequestConfig = {
  errorConfig: {},
  timeout: 10e3,
};
