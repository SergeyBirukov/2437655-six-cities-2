import { UserType } from '../../types/user-type.enum.js';
import { User } from '../../types/user.type.js';
import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { createSHA256 } from '../../core/helpers/hash.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
    schemaOptions: {
        collection: 'users'
    }
})

export class UserEntity extends defaultClasses.TimeStamps implements User {
    @prop({ required: true, default: '' })
    public name: string;
    @prop({ unique: true, required: true })
    public email: `${string}@${string}`;
    @prop({ required: false, default: '' })
    public avatar: `${string}.${'jpg' | 'png'}`;
    @prop({ required: true, default: '' })
    public password: string;
    @prop({ required: true, default: '' })
    public type: UserType;

    constructor(userData: User){
        super();

        this.name = userData.name;
        this.email = userData.email;
        this.avatar = userData.avatar;
        this.password = userData.password;
        this.type = userData.type;
    }

    public setPassword(password: string, salt: string){
        this.password = createSHA256(password, salt);
    }

    public getPassword(){
        return this.password;
    }
}

export const UserModel = getModelForClass(UserEntity);