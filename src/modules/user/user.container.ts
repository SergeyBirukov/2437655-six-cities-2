import { Container } from 'inversify';
import { UserService } from './user-service.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { DefaultUserService } from './default-user.service.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './user.entity.js';

export function createUserContainer() {
    const userContainer = new Container();
    userContainer.bind<UserService>(AppComponent.UserService).to(DefaultUserService).inSingletonScope();
    userContainer.bind<types.ModelType<UserEntity>>(AppComponent.UserModel).toConstantValue(UserModel);

  return userContainer;
}