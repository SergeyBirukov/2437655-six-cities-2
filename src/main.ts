import 'reflect-metadata';
import { Container } from 'inversify';
import RestApplication from './app/rest.js';
import { AppComponent } from './types/app-component.enum.js';
import { createRestApplicationContainer } from './rest/rest.contaner.js';
import { createUserContainer } from './modules/user/user.container.js';
import { createOfferContainer } from './modules/offer/offer.container.js';

async function bootstrap() {
  const appContainer = Container.merge(createRestApplicationContainer(), createUserContainer(), createOfferContainer());
  const application = appContainer.get<RestApplication>(AppComponent.RestApplication);
  await application.init();
}

bootstrap();
