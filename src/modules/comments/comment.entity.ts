import typegoose, { defaultClasses, getModelForClass, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { OfferEntity } from '../offer/offer.entity.js';

const { prop, modelOptions } = typegoose;

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  },
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
    trim: true,
    minlength: [5, 'Min length for comment is 5'],
    maxlength: [1024, 'Max length for comment is 1024'],
  })
  public text!: string;

  @prop({ required: false })
  public publicationDate!: Date;

  @prop({required: true, min: [1, 'Min rating is 1'], max: [5, 'Max rating is 5']})
  public rating!: number;

  @prop({ref: UserEntity, required: true})
  public userId!: Ref<UserEntity>;

  @prop({ref: OfferEntity, required: true})
  public offerId!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
