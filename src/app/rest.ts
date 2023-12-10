import { LoggerInterface } from '../logger/logger.interface';

export default class RestApplication {
    constructor(
      private readonly logger: LoggerInterface
    ) {}
  
    public async init() {
      this.logger.info('Application initialization…');
    }
  }