import { IsInt } from 'class-validator';

export class UserModel {
  @IsInt()
  id!: number;

  name!: string;
}
