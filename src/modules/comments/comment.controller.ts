import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { ControllerBase } from '../../rest/contoller/contoller-base.abstract.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { AppComponents } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../rest/types/http-method.enum.js';
import { ValidateDtoMiddleware } from '../../rest/middleware/validate-dto.middleware.js';
import CommentResponse from './dto/comment-response.dto.js';
import {CreateCommentRequest } from './dto/create-comment.request.js';
import {IsDocumentExistsMiddleware} from '../../rest/middleware/is-document-exists.middleware.js';
import { plainToInstance } from 'class-transformer';

@injectable()
export default class CommentController extends ControllerBase {
  constructor(
    @inject(AppComponents.LoggerInterface) protected readonly logger: LoggerInterface,
    @inject(AppComponents.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(AppComponents.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCommentRequest),
        new IsDocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });
  }

  public async create({ body }: Request<object, object, CreateCommentRequest>, res: Response): Promise<void> {
    const comment = await this.commentService.create(body);
    this.created(res, plainToInstance(CommentResponse, comment, { excludeExtraneousValues: true }));
  }
}
