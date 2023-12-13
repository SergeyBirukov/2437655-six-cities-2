import { defaultClasses, getModelForClass, prop, modelOptions, Ref, Severity } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { City } from '../../types/city.enum.js';
import { Facility } from '../../types/facility-type.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { Coordinates } from '../../types/coordinates.type.js';
export interface OfferEntity extends defaultClasses.Base {}

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
    public postDate!: Date;

    @prop({ required: true, enum: City })
    public city!: City;

    @prop({ required: true })
    public preview!: string;

    @prop({ required: true, type: String, default: [] })
    public photos!: Array<string>;

    @prop({ required: true })
    public isPremium!: boolean;

    @prop({ required: true })
    public isFavorite!: boolean;

    @prop({ required: true })
    public rating!: number;

    @prop({ required: true, enum: HousingType })
    public housingType!: HousingType;

    @prop({ required: true })
    public roomsCount!: number;

    @prop({ required: true })
    public guestsCount!: number;

    @prop({ required: true })
    public price!: number;

    @prop({ required: true, enum: Facility, type: String, default: [] })
    public facilities!: Array<Facility>;

    @prop({ required: true, ref: UserEntity })
    public author!: Ref<UserEntity>;

    @prop({ required: true })
    public commentsCount!: number;

    @prop({ required: true, allowMixed: Severity.ALLOW })
    public coordinates!: Coordinates;
}

export const OfferModel = getModelForClass(OfferEntity);
