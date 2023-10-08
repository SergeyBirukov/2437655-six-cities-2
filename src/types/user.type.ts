import { UserType } from './user-type.enum';

export type User = {
  name: string;
  email: `${string}@${string}`;
  avatar: `${string}.${'jpg' | 'png'}`;
  password: string;
  type: UserType;
}
