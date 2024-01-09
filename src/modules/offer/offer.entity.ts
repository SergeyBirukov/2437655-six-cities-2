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
    @prop({
      required: true,
      trim: true,
      minlength: [10, 'Min length for name is 10'],
      maxlength: [100, 'Max length for name is 15'],
    })
  public title!: string;

    @prop({
      required: true,
      trim: true,
      minlength: [20, 'Min length for description is 20'],
      maxlength: [1024, 'Max length for description is 1024']
    })
    public description!: string;

    @prop({ required: true })
    public postDate!: Date;

    @prop({required: true, type: () => String, enum: City})
    public city!: City;

    @prop({ required: true })
    public preview!: string;

    @prop({type: () => [String], minCount: [6, 'Images count should be 6'], maxCount: [6, 'Images count should be 6']})
    public photos!: Array<string>;

    @prop({ required: true, default: false })
    public isPremium!: boolean;

    @prop({ required: true })
    public isFavorite!: boolean;

    @prop({required: true, type: () => String, enum: HousingType})
    public housingType!: HousingType;

    @prop({ required: true })
    public roomsCount!: number;

    @prop({required: true, min: [1, 'Min count of guests is 1'], max: [10, 'Max count of guests is 10']})
    public guestsCount!: number;

    @prop({required: true, min: [100, 'Min cost is 100'], max: [100000, 'Max cost is 100000']})
    public price!: number;

    @prop({required: true, type: () => String, enum: Facility})
    public facilities!: Array<Facility>;

    @prop({ref: UserEntity, required: true})
    public userId!: Ref<UserEntity>;

    @prop({ default: 0 })
    public commentsCount!: number;

    @prop({ required: true, allowMixed: Severity.ALLOW })
    public coordinates!: Coordinates;

    @prop({required: false, default: 1, min: [1, 'Min rating is 1'], max: [5, 'Max rating is 5']})
    public rating!: number;
}

export const OfferModel = getModelForClass(OfferEntity);
