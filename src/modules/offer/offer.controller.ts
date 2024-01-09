import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { ControllerBase } from '../../rest/contoller/contoller-base.abstract.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { AppComponents } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../rest/types/http-method.enum.js';
import { CreateOfferRequest } from './dto/create-offer.request.js';
import { OfferResponse } from './dto/offer.response.js';
import { ParamsDictionary } from 'express-serve-static-core';
import {CommentServiceInterface} from '../comments/comment-service.interface.js';
import {UserServiceInterface} from '../user/user-service.interface.js';
import {ValidateDtoMiddleware} from '../../rest/middleware/validate-dto.middleware.js';
import {CreateCommentRequest} from '../comments/dto/create-comment.request.js';
import {ValidateObjectIdMiddleware} from '../../rest/middleware/validate-objectId.middleware.js';
import {IsDocumentExistsMiddleware} from '../../rest/middleware/is-document-exists.middleware.js';
import {UpdateOfferRequest} from './dto/update-offer.request.js';
import {FavoriteOfferResponse} from './dto/favorite-offer-response.dto.js';
import {PrivateRouteMiddleware} from '../../rest/middleware/private-route.middleware.js';

export type ParamsOffer = { offerId: string; } | ParamsDictionary;
export type ParamsCity = { city: string; } | ParamsDictionary;

@injectable()
export default class OfferController extends ControllerBase {
  constructor(
    @inject(AppComponents.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponents.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
    @inject(AppComponents.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponents.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController...');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentRequest),
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.get,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new IsDocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferRequest),
        new IsDocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
      ]
    });

    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremium
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Post,
      handler: this.addFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new IsDocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new IsDocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [new PrivateRouteMiddleware()]
    });
  }

  public async index({ params }: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const offers = await this.offerService.find(limit);
    this.ok(res, plainToInstance(OfferResponse, offers, { excludeExtraneousValues: true }));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferRequest>,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async get({ params }: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${params.offerId}`);
    this.ok(res, plainToInstance(OfferResponse, offer, { excludeExtraneousValues: true }));
  }

  public async update(
    { params, body }: Request<ParamsOffer, unknown, UpdateOfferRequest>,
    res: Response,
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, updatedOffer);
  }

  public async delete({ params }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.offerService.deleteById(params.offerId);
    await this.commentService.deleteByOfferId(params.offerId);
    this.noContent(res, `Offer ${params.offerId} was deleted.`);
  }

  public async getPremium({ params }: Request<ParamsCity>, res: Response): Promise<void> {
    const offers = await this.offerService.findPremiumByCity(params.city);
    this.ok(res, plainToInstance(OfferResponse, offers, { excludeExtraneousValues: true }));
  }

  public async getFavorites({ user }: Request, _res: Response): Promise<void> {
    const offers = await this.userService.findFavorites(user.id);
    this.ok(_res, plainToInstance(FavoriteOfferResponse, offers, { excludeExtraneousValues: true }));
  }

  public async addFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.addToFavoritesById(params.offerId, user.id);
    this.noContent(res, { message: 'Offer was added to favorite' });
  }

  public async deleteFavorite({ params, user }: Request<ParamsOffer>, res: Response): Promise<void> {
    await this.userService.removeFromFavoritesById(params.offerId, user.id);
    this.noContent(res, { message: 'Offer was removed from favorite' });
  }
}
