import { ConfigInterface } from '../core/config/config.interface';
import { LoggerInterface } from '../logger/logger.interface';
import { RestSchema } from '../core/config/rest.schema';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../types/app-component.enum';

@injectable()
export default class RestApplication {
    constructor(
      @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
      @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<RestSchema>
    ) {}
  
    public async init() {
      this.logger.info('Application initialization…');
      this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    }
  }