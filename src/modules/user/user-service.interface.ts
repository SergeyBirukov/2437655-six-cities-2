import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserRequest } from './dto/create-user.request.js';
import { OfferEntity } from '../offer/offer.entity.js';

export interface UserServiceInterface {
  create(dto: CreateUserRequest): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findById(userId: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserRequest): Promise<DocumentType<UserEntity>>;
  addToFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  removeFromFavoritesById(userId: string, offerId: string): Promise<DocumentType<OfferEntity>[] | null>;
  findFavorites(userId: string): Promise<DocumentType<OfferEntity>[]>;
}
