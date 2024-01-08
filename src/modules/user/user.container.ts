import { Container } from 'inversify';
import { UserServiceInterface } from './user-service.interface.js';
import { AppComponents } from '../../types/app-component.enum.js';
import { UserService } from './user.service.js';
import { types } from '@typegoose/typegoose';
import { UserEntity, UserModel } from './user.entity.js';
import {ControllerBase} from '../../rest/contoller/contoller-base.abstract.js';
import UserController from './user.controller.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserServiceInterface>(AppComponents.UserServiceInterface).to(UserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(AppComponents.UserModel).toConstantValue(UserModel);
  userContainer.bind<ControllerBase>(AppComponents.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
