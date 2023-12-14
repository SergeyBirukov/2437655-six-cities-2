import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { AppComponent } from '../../types/app-component.enum.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { OfferService } from './offer-service.interface.js';
import { DefaultOfferService } from './default-offer.service.js';
import OfferController from './offer.controller.js';
import { Controller } from '../../rest/contoller/contoller.abstract.js';

export function createOfferContainer() {
  const offerController = new Container();
  offerController.bind<OfferService>(AppComponent.OfferService).to(DefaultOfferService).inSingletonScope();
  offerController.bind<types.ModelType<OfferEntity>>(AppComponent.OfferModel).toConstantValue(OfferModel);
  offerController.bind<Controller>(AppComponent.OfferController).to(OfferController).inSingletonScope();

  return offerController;
}
