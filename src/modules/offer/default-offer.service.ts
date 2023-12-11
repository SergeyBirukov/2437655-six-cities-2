import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../logger/logger.interface';
import { AppComponent } from '../../types/app-component.enum';
import { OfferService } from './offer-service.interface';
import { OfferEntity } from './offer.entity';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto';

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
}
