import { defaultClasses, getModelForClass, prop, modelOptions, Ref, Severity } from '@typegoose/typegoose';
import { UserEntity } from "../user/user.entity";
import { City } from "../../types/city.enum";
import { Facility } from "../../types/facility-type.enum";
import { HousingType } from "../../types/housing-type.enum";
import { Coordinates } from "../../types/coordinates.type";
export interface OfferEntity extends defaultClasses.Base {};

@modelOptions({
    schemaOptions: {
        collection: 'offers'
    }
})
export class OfferEntity extends defaultClasses.TimeStamps {
    @prop({ required: true })
    public title!: string;
  
    @prop({ required: true })
    public description!: string;
  
    @prop({ required: true })
    public publicationDate!: Date;
  
    @prop({ required: true, enum: City })
    public city!: City;
  
    @prop({ required: true })
    public preview!: string;
  
    @prop({ required: true, type: String, default: [] })
    public images!: Array<string>;
  
    @prop({ required: true })
    public isPremium!: boolean;
  
    @prop({ required: true })
    public isFavourite!: boolean;
  
    @prop({ required: true })
    public rating!: number;
  
    @prop({ required: true, enum: HousingType })
    public housingType!: HousingType;
  
    @prop({ required: true })
    public roomCount!: number;
  
    @prop({ required: true })
    public guestCount!: number;
  
    @prop({ required: true })
    public cost!: number;
  
    @prop({ required: true, enum: Facility, type: String, default: [] })
    public facility!: Array<Facility>;
  
    @prop({ required: true, ref: UserEntity })
    public author!: Ref<UserEntity>;
  
    @prop({ required: true })
    public commentsCount!: number;
  
    @prop({ required: true, allowMixed: Severity.ALLOW })
    public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);