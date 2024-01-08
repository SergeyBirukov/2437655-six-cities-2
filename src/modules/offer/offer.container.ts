import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { AppComponents } from '../../types/app-component.enum.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { OfferService } from './offer.service.js';
import OfferController from './offer.controller.js';
import { ControllerBase } from '../../rest/contoller/contoller-base.abstract.js';

export function createOfferContainer() {
  const offerContainer = new Container();
  offerContainer.bind<OfferServiceInterface>(AppComponents.OfferService).to(OfferService).inSingletonScope();
  offerContainer.bind<types.ModelType<OfferEntity>>(AppComponents.OfferModel).toConstantValue(OfferModel);
  offerContainer.bind<ControllerBase>(AppComponents.OfferController).to(OfferController).inSingletonScope();

  return offerContainer;
}
