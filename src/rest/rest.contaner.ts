import { Container } from 'inversify';
import { Logger } from '../logger/logger.interface.js';
import PinoService from '../services/pino.service.js';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import ConfigService from '../core/config/config.service.js';
import { DatabaseClient } from '../core/database-client/database-client.interface.js';
import MongoClientService from '../core/database-client/mongo-client.service.js';
import { AppComponent } from '../types/app-component.enum.js';
import RestApplication from '../app/rest.js';

export function createRestApplicationContainer() {
  const container = new Container();
  container.bind<RestApplication>(AppComponent.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();
  container
    .bind<DatabaseClient>(AppComponent.DatabaseClientInterface)
    .to(MongoClientService)
    .inSingletonScope();

  return container;
}
