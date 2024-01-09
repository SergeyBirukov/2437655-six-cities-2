import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { ControllerBase} from '../../rest/contoller/contoller-base.abstract.js';
import { LoggerInterface} from '../../logger/logger.interface.js';
import { UserServiceInterface} from './user-service.interface.js';
import { AppComponents} from '../../types/app-component.enum.js';
import { HttpMethod} from '../../rest/types/http-method.enum.js';
import { CreateUserRequest } from './dto/create-user.request.js';
import {LoginUserRequest} from './dto/login-user.request.js';
import { HttpError} from '../../rest/exceptions/http-error.enum.js';
import { OfferResponse} from '../offer/dto/offer.response.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {RestSchema} from '../../core/config/rest.schema.js';
import {ValidateObjectIdMiddleware} from '../../rest/middleware/validate-objectId.middleware.js';
import {UploadFileMiddleware} from '../../rest/middleware/upload-file.js';
import {PrivateRouteMiddleware} from '../../rest/middleware/private-route.middleware.js';
import {createJWT} from '../../core/helpers/jwt.js';
import {LoginUserResponse} from './dto/login-user.response.js';
import {BLACK_LIST_TOKENS} from '../../rest/middleware/authenticate.middleware.js';

type LoginUserRequestType = Request<Record<string, unknown>, Record<string, unknown>, LoginUserRequest>;

@injectable()
export default class UserController extends ControllerBase {
  constructor(
    @inject(AppComponents.LoggerInterface) logger: LoggerInterface,
    @inject(AppComponents.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>
  ) {
    super(logger);

    this.logger.info('Register routes for UserController...');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.register });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Post, handler: this.addFavorite });
    this.addRoute({ path: '/favorite/:offerId', method: HttpMethod.Delete, handler: this.deleteFavorite });
    this.addRoute({ path: '/favorite', method: HttpMethod.Get, handler: this.getFavorite });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar'),
      ],
    });
    this.addRoute({path: '/login', method: HttpMethod.Get, handler: this.checkAuthenticate});
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Post,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()],
    });
  }

  public async register(
    { body }: Request<Record<string, unknown>,
      Record<string, unknown>, CreateUserRequest>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email ${body.email} already exists.`, 'UserController');
    }

    const result = await this.userService.create(body);
    this.created(res, plainToInstance(CreateUserRequest, result, { excludeExtraneousValues: true }));
  }

  public async login({ body }: LoginUserRequestType, res: Response): Promise<void> {
    const user = await this.userService.verifyUser(body);

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }

    const token = await createJWT(this.config.get('JWT_SECRET'), {email: user.email, id: user.id,});
    this.ok(
      res,
      plainToInstance(
        LoginUserResponse,
        {email: user.email, token},
        { excludeExtraneousValues: true },
      ),
    );
  }

  public async logout(req: Request, res: Response): Promise<void> {
    const [, token] = String(req.headers.authorization?.split(' '));

    if (!req.user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }

    BLACK_LIST_TOKENS.add(token);

    this.noContent(res, { token });
  }

  public async getFavorite(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, { userId: string }>,
    _res: Response,
  ): Promise<void> {
    const result = await this.userService.findFavorites(body.userId);
    this.ok(_res, plainToInstance(OfferResponse, result, { excludeExtraneousValues: true }));
  }

  public async addFavorite(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, { offerId: string; userId: string }>,
    res: Response,
  ): Promise<void> {
    await this.userService.addToFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Offer added to favourites' });
  }

  public async deleteFavorite(
    { body }: Request<Record<string, unknown>, Record<string, unknown>, { offerId: string; userId: string }>,
    res: Response,
  ): Promise<void> {
    await this.userService.removeFromFavoritesById(body.offerId, body.userId);
    this.noContent(res, { message: 'Offer deleted from favourites' });
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path,
    });
  }

  public async checkAuthenticate({ user }: Request, res: Response) {
    this.logger.info(`Check authenticate for user: ${user?.email}`);
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }
    const foundedUser = await this.userService.findByEmail(user.email);

    if (!foundedUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }

    this.ok(res, plainToInstance(LoginUserResponse, foundedUser, { excludeExtraneousValues: true }));
  }
}
