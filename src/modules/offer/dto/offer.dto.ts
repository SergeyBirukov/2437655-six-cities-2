
import { Expose } from "class-transformer";
import { HousingType } from "../../../types/housing-type.enum";
import { City } from "../../../types/city.enum";

export class OfferDto {
    @Expose()
    id!: string;
  
    @Expose()
    title!: string;
  
    @Expose()
    postDate!: Date;
  
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
  }