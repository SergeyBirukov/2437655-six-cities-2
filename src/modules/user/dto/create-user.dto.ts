import { UserType } from '../../../types/user-type.enum';

export class CreateUserDto {
  public name!: string;
  public email!: string;
  public avatar?: string;
  public password!: string;
  public type!: UserType;
}
