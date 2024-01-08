import {Expose} from 'class-transformer';
import {City} from '../../../types/city.enum.js';
import {HousingType} from '../../../types/housing-type.enum.js';

export class FavoriteOfferResponse {
  @Expose()
  public id!: string;

  @Expose()
    title!: string;

  @Expose()
    postData!: Date;

  @Expose()
    city!: City;

  @Expose()
    preview!: string;

  @Expose()
    isPremium!: boolean;

  favorite = true;

  @Expose()
    rating!: number;

  @Expose()
    housingType!: HousingType;

  @Expose()
    price!: number;

  @Expose()
    commentsCount!: number;
}
