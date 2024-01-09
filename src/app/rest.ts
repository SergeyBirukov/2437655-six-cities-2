import { ConfigInterface } from '../core/config/config.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { inject, injectable } from 'inversify';
import { AppComponents } from '../types/app-component.enum.js';
import { DatabaseClient } from '../core/database-client/database-client.interface.js';
import { getMongoURI } from '../core/helpers/db.js';
import express, { Express } from 'express';
import {ExceptionFilterInterface} from '../rest/exceptions/exception-filter.interface.js';
import {ControllerBase} from '../rest/contoller/contoller-base.abstract.js';

@injectable()
export default class RestApplication {
  private expressApp: Express;

  constructor(
      @inject(AppComponents.LoggerInterface) private readonly logger: LoggerInterface,
      @inject(AppComponents.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
      @inject(AppComponents.DatabaseClientInterface) private readonly databaseClient: DatabaseClient,
      @inject(AppComponents.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
      @inject(AppComponents.UserController) private readonly userController: ControllerBase,
      @inject(AppComponents.OfferController) private readonly offerController: ControllerBase,
  ) {
    this.expressApp = express();
  }

  public async init() {
    this.logger.info('Application initialization...');

    await this._initDb();
    await this._initRoutes();
    await this._initMiddlewares();
    await this._initExceptionFilters();
    await this._initServer();
  }

  private async _initDb() {
    this.logger.info('Init database...');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);
    this.logger.info('Init database completed');
  }

  private async _initServer() {
    this.logger.info('Try to init server...');

    const port = this.config.get('PORT');
    this.expressApp.listen(port);

    this.logger.info(`Server started on http://localhost:${this.config.get('PORT')}`);
  }

  private async _initMiddlewares(){
    this.expressApp.use(express.json());
  }

  private async _initRoutes() {
    this.expressApp.use('/offers', this.offerController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
  }

  private async _initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }
}
