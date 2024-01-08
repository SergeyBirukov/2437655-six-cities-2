import {Expose, Type} from 'class-transformer';
import { HousingType } from '../../../types/housing-type.enum';
import { City } from '../../../types/city.enum';
import {Coordinates} from '../../../types/coordinates.type.js';
import {UserResponse} from '../../user/dto/user-response.dto.js';
import {Facility} from '../../../types/facility-type.enum.js';

export class OfferResponseDto {
    @Expose()
  public id!: string;

    @Expose()
      title!: string;

    @Expose()
      postDate!: Date;

    @Expose()
      description!: string;

    @Expose()
      city!: City;

    @Expose()
      preview!: string;

    @Expose()
      isPremium!: boolean;

    @Expose()
      rating!: number;

    @Expose()
      housingType!: HousingType;

    @Expose()
      price!: number;

    @Expose()
      commentsCount!: number;

    @Expose()
      guestsCount!: number;

    @Expose()
      facilities!: Facility[];

    @Expose({ name: 'userId' })
    @Type(() => UserResponse)
      offerAuthor!: UserResponse;

    @Expose()
      coordinates!: Coordinates;
}


