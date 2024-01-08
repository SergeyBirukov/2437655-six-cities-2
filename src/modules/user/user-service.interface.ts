import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import {OfferEntity} from '../offer/offer.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
