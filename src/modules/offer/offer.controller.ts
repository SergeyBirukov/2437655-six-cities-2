import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { ControllerBase } from '../../rest/contoller/contoller-base.abstract.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { AppComponents } from '../../types/app-component.enum.js';
import { HttpMethod } from '../../rest/types/http-method.enum.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferResponseDto } from './dto/offer-response.dto.js';
import { ParamsDictionary } from 'express-serve-static-core';
import {CommentServiceInterface} from '../comments/comment-service.interface.js';
import {UserServiceInterface} from '../user/user-service.interface.js';
import {ValidateDtoMiddleware} from '../../rest/middleware/validate-dto.middleware.js';
import {CreateCommentDto} from '../comments/dto/create-comment.dto.js';
import {ValidateObjectIdMiddleware} from '../../rest/middleware/validate-objectId.middleware.js';
import {IsDocumentExistsMiddleware} from '../../rest/middleware/is-document-exists.middleware.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';
import {FavoriteOfferResponse} from './dto/favourite-offer-response.dto.js';

export type ParamsOffer = { offerId: string; } | ParamsDictionary;
export type ParamsCity = { city: string; } | ParamsDictionary;

@injectable()
export default class OfferController extends ControllerBase {
  constructor(
    @inject(AppComponents.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponents.OfferService) private readonly offerService: OfferServiceInterface,
    @inject(AppComponents.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponents.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index
    });

    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCommentDto)]
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
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new IsDocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });

    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')]
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
        new ValidateObjectIdMiddleware('offerId'),
        new IsDocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites/:offerId',
      method: HttpMethod.Delete,
      handler: this.deleteFavorite,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new IsDocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ],
    });

    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
    });
  }

  public async index({ params }: Request<Record<string, unknown>>, res: Response): Promise<void> {
    const limit = params.limit ? parseInt(`${params.limit}`, 10) : undefined;
    const offers = await this.offerService.find(limit);
    this.ok(res, plainToInstance(OfferResponseDto, offers, { excludeExtraneousValues: true }));
  }

  public async create(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response,
  ): Promise<void> {
    const result = await this.offerService.create(body);
    this.created(res, result);
  }

  public async get({ params }: Request<ParamsOffer>, res: Response): Promise<void> {
    const offer = await this.offerService.findById(`${params.offerId}`);
    this.ok(res, plainToInstance(OfferResponseDto, offer, { excludeExtraneousValues: true }));
  }

  public async update(
    { params, body }: Request<ParamsOffer, unknown, UpdateOfferDto>,
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
    this.ok(res, plainToInstance(OfferResponseDto, offers, { excludeExtraneousValues: true }));
  }

  public async getFavorites(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, { userId: string; }>,
    _res: Response,
  ): Promise<void> {
    const offers = await this.userService.findFavorites(body.userId);
    this.ok(_res, plainToInstance(FavoriteOfferResponse, offers, { excludeExtraneousValues: true }));
  }

  public async addFavorite({ body }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { offerId: string; userId: string; }>,
  res: Response,
  ): Promise<void> {
    await this.userService.addToFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Offer was added to favorite' });
  }

  public async deleteFavorite(
    { body }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { offerId: string; userId: string; }>,
    res: Response,
  ): Promise<void> {
    await this.userService.removeFromFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Offer was removed from favorite' });
  }
}
