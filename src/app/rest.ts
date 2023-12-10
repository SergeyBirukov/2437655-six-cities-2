import { ConfigInterface } from '../core/config/config.interface';
import { LoggerInterface } from '../logger/logger.interface';
import { RestSchema } from '../core/config/rest.schema';

export default class RestApplication {
    constructor(
      private readonly logger: LoggerInterface,
      private readonly config: ConfigInterface<RestSchema>
    ) {}
  
    public async init() {
      this.logger.info('Application initialization…');
      this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    }
  }