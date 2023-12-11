import { ICliCommand } from './cli-command.interface.js';
import chalk from 'chalk';
import { FileReader } from '../../services/file-service.js';
import { UserService } from '../../modules/user/user-service.interface.js';
import { OfferService } from '../../modules/offer/offer-service.interface.js';
import { DatabaseClient } from '../database-client/database-client.interface.js';
import { Logger } from '../../logger/logger.interface.js';
import ConsoleService from '../../logger/console.logger.js';
import { DefaultOfferService } from '../../modules/offer/default-offer.service.js';
import { OfferModel } from '../../modules/offer/offer.entity.js';
import { DefaultUserService } from '../../modules/user/default-user.service.js';
import { UserModel } from '../../modules/user/user.entity.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import { parseOffer } from '../../services/mock-offer-generator.js';
import { Offer } from '../../types/offer.type.js';

const DEFAULT_USER_PASSWORD = 'pwd123';

export class ImportCommand implements ICliCommand {
  public readonly name = '--import';

  private readonly userService: UserService;
  private readonly offerService: OfferService;
  private readonly databaseClient: DatabaseClient;
  private readonly logger: Logger;

  constructor() {
    this.logger = new ConsoleService();
    this.offerService = new DefaultOfferService(this.logger, OfferModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoClientService(this.logger);
  }

  public async execute(filename: string, connectionString: string, salt: string): Promise<void> {
    await this.databaseClient.connect(connectionString);
    try {
      this.readOffers(filename.trim(), salt)
        .then((count: number) => {
          this.logger.info(`File ${chalk.blueBright(filename)} was successfully read. ${count} offers were imported`);
        });
    } catch (err) {
      this.logger.error(`${chalk.redBright(`ERROR! Can't read the file: ${(err as Error).message}`)}`);
    }
  }

  private async readOffers(filename: string, salt: string): Promise<number> {
    const fileReader = new FileReader(filename.trim());
    let count = 0;

    for await (const offer of fileReader.read()) {
      await this.saveOffer(parseOffer(offer), salt);
      count++;
    }

    return count;
  }

  private async saveOffer(offer: Offer, salt: string) {
    const user = await this.userService.findOrCreate({
      ...offer.author,
      password: DEFAULT_USER_PASSWORD,
    }, salt);

    await this.offerService.create({...offer, author: user.id });
  }
}
