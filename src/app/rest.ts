import { ConfigInterface } from '../core/config/config.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { RestSchema } from '../core/config/rest.schema.js';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../types/app-component.enum.js';
import { DatabaseClient } from '../core/database-client/database-client.interface.js';
import { getMongoURI } from '../core/helpers/db.js';
import express, { Express } from 'express';

@injectable()
export default class RestApplication {
  private expressApplication: Express;

  constructor(
      @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
      @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>,
      @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClient
  ) {
    this.expressApplication = express();
  }

  public async init() {
    this.logger.info('Application initialization…')

    await this._initDb();
    await this._initServer();
  }

  private async _initDb() {
    this.logger.info('Init database…');

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
    this.logger.info('Try to init server…');

    const port = this.config.get('PORT');
    this.expressApplication.listen(port);

    this.logger.info(`🚀Server started on http://localhost:${this.config.get('PORT')}`);
  }
}
