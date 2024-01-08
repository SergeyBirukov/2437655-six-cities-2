import {IsInt, IsMongoId, IsNotEmpty, IsString, Length, Max, Min} from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(5, 1024, { message: 'Min length is 5, max is 1024' })
  public text!: string;

  @IsMongoId({ message: 'Invalid offerId' })
  public offerId!: string;

  @IsInt({ message: 'rating should be an integer.' })
  @IsNotEmpty({ message: 'rating is required.' })
  @Min(1, { message: 'Invalid rating value, min value is 1.' })
  @Max(10, { message: 'Invalid rating value, min value is 10.' })
  public rating!: number;

  public userId!: string;
}
