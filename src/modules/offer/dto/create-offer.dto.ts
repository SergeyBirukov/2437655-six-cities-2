import { City } from '../../../types/city.enum.js';
import { Facility } from '../../../types/facility-type.enum.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { User } from '../../../types/user.type.js';


export class CreateOfferDto {
  public title!: string;
  public description!: string;
  public postDate!: Date;
  public city!: City;
  public preview!: string;
  public photos!: Array<string>;
  public isPremium!: boolean;
  public housingType!: HousingType;
  public roomsCount!: number;
  public guestsCount!: number;
  public price!: number;
  public facilities!: Array<Facility>;
  public userId!: User;
  public coordinates!: Coordinates;
}
