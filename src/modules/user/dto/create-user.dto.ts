import { UserType } from "../../../types/user-type.enum";

export class CreateUserDto {
    public name!: string;
    public email!:  `${string}@${string}`;
    public avatar!: `${string}.${'jpg' | 'png'}`;
    public password!: string;
    public type!: UserType;
  }