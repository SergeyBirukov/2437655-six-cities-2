import { City } from '../../../types/city.enum.js';
import { Facility } from '../../../types/facility-type.enum.js';
import { HousingType } from '../../../types/housing-type.enum.js';
import { Coordinates } from '../../../types/coordinates.type.js';
import { User } from '../../../types/user.type.js';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum, IsObject,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';


export class CreateOfferRequest {
  @MinLength(10, { message: 'Min title length = 10' })
  @MaxLength(100, { message: 'Max title length = 100' })
  public title!: string;

  @MinLength(20, { message: 'Min description length = 20' })
  @MaxLength(1024, { message: 'Max description length = 1024' })
  public description!: string;

  @IsDateString({}, { message: 'postDate must be a valid ISO string' })
  public postDate!: Date;

  @IsEnum(City, { message: 'Unknown city' })
  public city!: City;

  @IsString({ message: 'Preview image path is required.' })
  public preview!: string;

  @IsArray({ message: 'Invalid photos format, must be an array' })
  @IsString({ each: true, message: 'image path should be string' })
  public photos!: Array<string>;

  @IsBoolean({ message: 'Invalid format, must be boolean' })
  public isPremium!: boolean;

  @IsEnum(HousingType, { message: 'Unknown housing type' })
  public housingType!: HousingType;

  @Min(1, { message: 'Invalid count of rooms. Min rooms count = 1' })
  @Max(8, { message: 'Invalid count of rooms. Max rooms count = 8' })
  public roomsCount!: number;

  @Min(1, { message: 'Invalid count of guests. Min guests count = 1' })
  @Max(10, { message: 'Invalid count of guests. Max guests count = 10'})
  public guestsCount!: number;

  @Min(100, { message: 'Invalid price. Min price = 100' })
  @Max(100000, { message: 'Invalid price. Max price =  100000' })
  public price!: number;

  @IsArray({ message: 'Invalid facilities format, must be an array' })
  @IsEnum(Facility, { each: true, message: 'Unknown facility type' })
  @ArrayNotEmpty({ message: 'There should be at least 1 facility' })
  public facilities!: Array<Facility>;

  public userId!: User;

  @IsObject({ message: 'Should be object of type Coordinates' })
  public coordinates!: Coordinates;
}
