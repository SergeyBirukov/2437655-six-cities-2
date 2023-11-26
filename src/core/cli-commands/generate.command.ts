import { ICliCommand } from './cli-command.interface.js';
import { MockData } from '../../types/mock-data.type.js';
import { FileWriter } from '../../services/file-service.js';
import { generateOffer } from '../../services/mock-offer-generator.js';
import got from 'got';

export class GenerateCommand implements ICliCommand {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(count: string, filepath: string, url: string): Promise<void> {
    const offerCount = Number.parseInt(count, 10);
    try {
      this.initialData = await got.get(url).json();
    } catch {
      console.log(`Can't fetch data from ${url}`);
      return;
    }

    const fileWriter = new FileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await fileWriter.write(generateOffer(this.initialData));
    }

    console.log(`File ${filepath} was successfully created`);
  }
}
