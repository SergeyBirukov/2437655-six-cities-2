import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment-service.interface.js';
import { AppComponents } from '../../types/app-component.enum.js';
import CommentService from './comment.service.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import {ControllerInterface} from '../../rest/contoller/controller.interface.js';
import CommentController from './comment.controller.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer
    .bind<CommentServiceInterface>(AppComponents.CommentServiceInterface)
    .to(CommentService)
    .inSingletonScope();
  commentContainer.bind<types.ModelType<CommentEntity>>(AppComponents.CommentModel).toConstantValue(CommentModel);
  commentContainer.bind<ControllerInterface>(AppComponents.CommentController).to(CommentController).inSingletonScope();
  return commentContainer;
}
