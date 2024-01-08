import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import {IsDocumentExistsInterface} from '../../common/is-document-exists.interface.js';
import {UpdateOfferDto} from './dto/update-offer.dto.js';

export interface OfferServiceInterface extends IsDocumentExistsInterface{
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;

  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  incCommentsCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateRating(offerId: string, rating: number): Promise<void>;

  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  find(count: number | undefined): Promise<DocumentType<OfferEntity>[]>;

  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;

  isExists(documentId: string): Promise<boolean>;
}
