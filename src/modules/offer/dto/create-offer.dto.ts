import { City } from '../../../types/city.enum.js';
import { Facility } from '../../../types/facility-type.enum.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { User } from '../../../types/user.type.js';


export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public publicationDate!: Date;
  public city!: City;
  public preview!: string;
  public images!: Array<string>;
  public isPremium!: boolean;
  public isFavourite!: boolean;
  public rating!: number;
  public housingType!: HousingType;
  public roomCount!: number;
  public guestCount!: number;
  public cost!: number;
  public facility!: Array<Facility>;
  public author!: User;
  public commentsCount!: number;
  public coordinates!: Coordinates;
}