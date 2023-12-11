import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { AppComponent } from '../../types/app-component.enum.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { OfferService } from './offer-service.interface.js';
import { DefaultOfferService } from './default-offer.service.js';

export function createOfferContainer() {
  const userContainer = new Container();
  userContainer.bind<OfferService>(AppComponent.UserService).to(DefaultOfferService).inSingletonScope();
  userContainer.bind<types.ModelType<OfferEntity>>(AppComponent.UserModel).toConstantValue(OfferModel);

  return userContainer;
}
