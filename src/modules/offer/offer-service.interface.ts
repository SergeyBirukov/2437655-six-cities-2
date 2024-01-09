import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferRequest } from './dto/create-offer.request.js';
import {IsDocumentExistsInterface} from '../../common/is-document-exists.interface.js';
import {UpdateOfferRequest} from './dto/update-offer.request.js';

export interface OfferServiceInterface extends IsDocumentExistsInterface{
  create(dto: CreateOfferRequest): Promise<DocumentType<OfferEntity>>;

  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  incCommentsCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  updateRating(offerId: string, rating: number): Promise<void>;

  updateById(offerId: string, dto: UpdateOfferRequest): Promise<DocumentType<OfferEntity> | null>;

  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;

  find(count: number | undefined): Promise<DocumentType<OfferEntity>[]>;

  findPremiumByCity(city: string): Promise<DocumentType<OfferEntity>[]>;

  isExists(documentId: string): Promise<boolean>;
}
