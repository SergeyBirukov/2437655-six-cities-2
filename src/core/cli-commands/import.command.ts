import { ICliCommand } from './cli-command.interface.js';
import chalk from 'chalk';
import { FileReader } from '../../services/file-service.js';
import { UserServiceInterface } from '../../modules/user/user-service.interface.js';
import { OfferServiceInterface } from '../../modules/offer/offer-service.interface.js';
import { DatabaseClient } from '../database-client/database-client.interface.js';
import { LoggerInterface } from '../../logger/logger.interface.js';
import ConsoleService from '../../logger/console.logger.js';
import { OfferService } from '../../modules/offer/offer.service.js';
import { OfferModel } from '../../modules/offer/offer.entity.js';
import { UserService } from '../../modules/user/user.service.js';
import { UserModel } from '../../modules/user/user.entity.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import { parseOffer } from '../../services/mock-offer-generator.js';
import { Offer } from '../../types/offer.type.js';
import {RestSchema} from '../config/rest.schema.js';
import {ConfigInterface} from '../config/config.interface.js';
import ConfigService from '../config/config.service.js';

const DEFAULT_USER_PASSWORD = 'pwd123';

export class ImportCommand implements ICliCommand {
  public readonly name = '--import';

  private readonly userService: UserServiceInterface;
  private readonly offerService: OfferServiceInterface;
  private readonly databaseClient: DatabaseClient;
  private readonly logger: LoggerInterface;
  private readonly config: ConfigInterface<RestSchema>;

  constructor() {
    this.logger = new ConsoleService();
    this.config = new ConfigService(this.logger);
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, UserModel, this.config);
    this.databaseClient = new MongoClientService(this.logger);
  }

  public async execute(filename: string, connectionString: string): Promise<void> {
    await this.databaseClient.connect(connectionString);
    try {
      this.readOffers(filename.trim())
        .then((count: number) => {
          this.logger.info(`File ${chalk.blueBright(filename)} was successfully read. ${count} offers were imported`);
        });
    } catch (err) {
      this.logger.error(`${chalk.redBright(`ERROR! Can't read the file: ${(err as Error).message}`)}`);
    }
  }

  private async readOffers(filename: string): Promise<number> {
    const fileReader = new FileReader(filename.trim());
    let count = 0;

    for await (const offer of fileReader.read()) {
      await this.saveOffer(parseOffer(offer));
      count++;
    }

    return count;
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD});

    await this.offerService.create({...offer, userId: user.id });
  }
}
