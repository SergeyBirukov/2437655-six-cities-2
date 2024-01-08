import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOrUpdateOfferDto } from './dto/create-or-update-offer.dto.js';

export interface OfferServiceInterface {
  create(dto: CreateOrUpdateOfferDto): Promise<DocumentType<OfferEntity>>;

  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  addRating(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null>;

  updateById(offerId: string, dto: CreateOrUpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  find(count: number | undefined): Promise<DocumentType<OfferEntity>[]>;

  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;
}
