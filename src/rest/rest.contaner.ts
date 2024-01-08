import { Container } from 'inversify';
import { LoggerInterface } from '../logger/logger.interface.js';
import PinoService from '../services/pino.service.js';
import { ConfigInterface } from '../core/config/config.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import ConfigService from '../core/config/config.service.js';
import { DatabaseClient } from '../core/database-client/database-client.interface.js';
import MongoClientService from '../core/database-client/mongo-client.service.js';
import { AppComponents } from '../types/app-component.enum.js';
import RestApplication from '../app/rest.js';
import ExceptionFilter from './exceptions/exception-filter.js';

export function createRestApplicationContainer() {
  const container = new Container();
  container.bind<RestApplication>(AppComponents.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<LoggerInterface>(AppComponents.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<RestSchema>>(AppComponents.ConfigInterface).to(ConfigService).inSingletonScope();
  container.bind<DatabaseClient>(AppComponents.DatabaseClientInterface).to(MongoClientService).inSingletonScope();
  container.bind<ExceptionFilter>(AppComponents.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();
  return container;
}
