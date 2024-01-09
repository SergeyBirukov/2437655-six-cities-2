import {Expose} from 'class-transformer';

export class LoginUserResponse {
  @Expose()
  public token!: string;

  @Expose()
  public refreshToken!: string;

  @Expose()
  public email!: string;
}
