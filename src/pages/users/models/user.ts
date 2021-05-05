import { BaseModel } from '@/core/model/BaseModel';
import { Expose } from 'class-transformer';
import { IsInt } from 'class-validator';

export class UserModel extends BaseModel {
  @IsInt()
  id!: number;

  name!: string;

  @Expose({ name: 'sex' })
  gender!: string;

  static async getUserById(id: number) {
    const res = await UserModel.request(`/api/user/${id}`, {
      method: 'GET',
      model: UserModel,
    });

    console.log('user.ts:23', res);
    return res;
  }
}
