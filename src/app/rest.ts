import { ConfigInterface } from '../core/config/config.interface';
import { LoggerInterface } from '../logger/logger.interface';

export default class RestApplication {
    constructor(
      private readonly logger: LoggerInterface,
      private readonly config: ConfigInterface
    ) {}
  
    public async init() {
      this.logger.info('Application initialization…');
      this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
    }
  }