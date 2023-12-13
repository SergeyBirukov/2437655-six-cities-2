import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../logger/logger.interface.js';
import { AppComponent } from '../../types/app-component.enum.js';
import { OfferService } from './offer-service.interface.js';
import { OfferEntity } from './offer.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor (
        @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
        @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ){}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).exec();
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          commentCount: 1,
        },
      })
      .exec();
  }

  public async addRating(offerId: string, rating: number): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        $inc: {
          ratingNumerator: rating,
          ratingDenominator: 1,
        },
      })
      .exec();
  }
}
