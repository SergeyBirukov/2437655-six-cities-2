import { inject, injectable } from 'inversify';
import { CreateCommentRequest } from './dto/create-comment.request.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { AppComponents } from '../../types/app-component.enum.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';

const COMMENTS_COUNT = 50;
const DESCENDING = -1;

@injectable()
export default class CommentService implements CommentServiceInterface {
  constructor(
    @inject(AppComponents.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(AppComponents.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {}

  public async create(dto: CreateCommentRequest): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    const offerId = dto.offerId;
    await this.offerService.incCommentsCount(offerId);
    await this.updateRating(offerId);

    return comment.populate('authorId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({ offerId })
      .sort({ createdAt: DESCENDING })
      .populate('authorId')
      .limit(COMMENTS_COUNT);
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel.deleteMany({ offerId }).exec();

    return result.deletedCount;
  }

  private async updateRating(offerId: string): Promise<void> {
    const rating = this.commentModel.find({ offerId }).select('rating');
    const offer = await this.offerService.findById(offerId);
    const count = offer?.commentsCount ?? 1;
    const newRating = rating['rating'] / count;
    await this.offerService.updateRating(offerId, newRating);
  }
}
