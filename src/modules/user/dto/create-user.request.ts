import { UserType } from '../../../types/user-type.enum.js';
import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

export class CreateUserRequest {
  @Length(1, 15, { message: 'Username length should be from 1 to 15.' })
  @IsString({ message: 'Username is required.' })
  public name!: string;

  @IsEmail({}, { message: 'Invalid email' })
  @IsString({ message: 'Email is required.' })
  public email!: string;

  @Length(6, 12, { message: 'Password length should be from 6 to 12.' })
  @IsString({ message: 'Password is required.' })
  public password!: string;

  @IsEnum(UserType, { message: 'Invalid user type' })
  public type!: UserType;
}
