import type { ClassType } from 'class-transformer-validator';
import { transformAndValidate } from 'class-transformer-validator';
import { request as fetch } from 'umi';
import type { RequestOptionsInit } from 'umi-request';

type BaseModelOptions<T> = RequestOptionsInit & {
  skipErrorHandler?: boolean;
  model: ClassType<T>;
};

interface BaseRes<T> {
  data: T;
}
export class BaseModel {
  static async request<T extends BaseModel>(
    url: string,
    { model, ...options }: BaseModelOptions<T>,
  ) {
    const res = await fetch<BaseRes<T>>(url, options);
    const user = await transformAndValidate<T>(model, res.data);
    return {
      ...res,
      data: user,
    };
  }
}
