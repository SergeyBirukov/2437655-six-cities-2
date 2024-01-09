import { UserType } from '../../types/user-type.enum.js';
import { User } from '../../types/user.type.js';
import typegoose, { defaultClasses, getModelForClass } from '@typegoose/typegoose';
import { createSHA256 } from '../../core/helpers/hash.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {RestSchema} from '../../core/config/rest.schema.js';

export interface UserEntity extends defaultClasses.Base {}
const { prop, modelOptions } = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
    @prop({ required: true, minlength: 1, maxlength: 15 })
  public name: string;

    @prop({ unique: true, required: true, match: [/^.+@.+$/, 'Email is incorrect'] })
    public email: string;

    @prop({ required: false, default: '', match: [/.*\.(?:jpg|png)/, 'Avatar must be jpg or png']})
    public avatar?: string;

    @prop({ required: true, default: '' })
    public password?: string;

    @prop({required: true, type: () => String, enum: UserType})
    public type: UserType;

    @prop({required: true, type: () => [String]})
    public favorite!: string[];

    constructor(userData: User,
    private readonly config?: ConfigInterface<RestSchema>){
      super();

      this.name = userData.name;
      this.email = userData.email;
      this.avatar = userData.avatar;
      this.type = userData.type;
    }

    public setPassword(password: string){
      this.password = createSHA256(password, this.config?.get('SALT') ?? '');
    }

    public getPassword(){
      return this.password;
    }
}

export const UserModel = getModelForClass(UserEntity);
