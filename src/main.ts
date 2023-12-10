import 'reflect-metadata';
import { Container } from 'inversify';
import PinoService from './services/pino.service.js';
import RestApplication from './app/rest.js';
import ConfigService from './core/config/config.service.js';
import { AppComponent } from './types/app-component.enum.js';
import { LoggerInterface } from './logger/logger.interface.js';
import { ConfigInterface } from './core/config/config.interface.js';
import { RestSchema } from './core/config/rest.schema.js';
import { DatabaseClientInterface } from './core/database-client/database-client.interface.js';
import MongoClientService from './core/database-client/mongo-client.service.js';
import { createRestApplicationContainer } from './rest/rest.contaner.js';
import { createUserContainer } from './modules/user/user.container.js';

async function bootstrap() {
  const appContainer = Container.merge(createRestApplicationContainer(), createUserContainer());
  const application = appContainer.get<RestApplication>(AppComponent.RestApplication);
  await application.init();
}

bootstrap();
