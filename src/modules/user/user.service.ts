import { UserServiceInterface } from './user-service.interface';
import { DocumentType, types } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { inject, injectable } from 'inversify';
import { AppComponents } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import {OfferEntity} from '../offer/offer.entity.js';
import {UserType} from '../../types/user-type.enum.js';
import {ConfigInterface} from '../../core/config/config.interface.js';
import {RestSchema} from '../../core/config/rest.schema.js';

@injectable()
export class UserService implements UserServiceInterface {
  constructor(
        @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponents.UserModel) private readonly userModel: types.ModelType<UserEntity>,
        @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
  ){}

  public async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, type: UserType.Regular }, this.config);
    user.setPassword(dto.password);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findById(userId: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ _id: userId });
  }

  public async findOrCreate(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto);
  }

  public async addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, { $push: { favorite: offerId }, new: true });
  }

  public async removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null> {
    return this.userModel.findByIdAndUpdate(userId, { $pull: { favorite: offerId }, new: true });
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const offers = await this.userModel.findById(userId).select('favorite');
    if (!offers) {
      return [];
    }

    return this.userModel.find({ _id: { $in: offers.favorite } });
  }
}
