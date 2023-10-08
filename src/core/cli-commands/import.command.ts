import { ICliCommand } from './cli-command.interface';
import { Offer } from '../../types/offer.type';
import fs from 'fs/promises'
import { resolve } from 'path'
import { City } from '../../types/city.enum';
import { EOL } from 'os';
import { HousingType } from '../../types/housing-type.enum';
import { Facility } from '../../types/facility-type.enum';
import { User } from '../../types/user.type';
import { UserType } from '../../types/user-type.enum';
import { Coordinates } from '../../types/coordinates.type';

export class ImportCommand implements ICliCommand{
  readonly name = '--import';

  public async execute(...params: string[]): Promise<void> {
    if(params.length == 0){
      console.log(`
      Команда import импортирует данные из tsv-файла.
      Пример: cli.js --import <path>
      Параметры:
        path: путь до tsv-файла`);
      return;
    }

    const path = params[0];
    const lines = (await fs.readFile(resolve(path), {encoding: 'utf-8'})).split(EOL);
    for (const line in lines) {
      const values = line.split(/\t/g);
      const offer: Offer = {
        title: values[0],
        description: values[1],
        postDate: new Date(values[2]),
        city: values[3] as City,
        preview: values[4],
        photos: values[5].split(';') as Offer["photos"],
        isPremium: values[6] === 'true',
        isFavorite: values[7] === 'false',
        rating: parseInt(values[8]),
        type: values[9] as HousingType,
        roomsCount: parseInt(values[10]),
        guestsCount: parseInt(values[11]),
        price: parseFloat(values[12]),
        facilities: values[13].split(';').map(value => value as Facility),
        author: await this.FindUserByName(values[14]),
        coordinates: await this.ParseCoordinates(values[15]),
        commentsCount: await this.GetCommentsCount()
      };
      console.log(JSON.stringify(offer))
    }

  }

  private async FindUserByName(userName: string): Promise<User>{
    return {name: userName, type: UserType.Pro, avatar: 'avatar.jpg', email: 'user@mail.com', password: 'pwd'};
  }

  private async ParseCoordinates(rawValue: string): Promise<Coordinates>{
    const [latitude, longitude] = rawValue.split(';').map(v => parseFloat(v));
    return {latitude: latitude, longitude: longitude};
  }

  private async GetCommentsCount(): Promise<number>{
    return 0;
  }

}