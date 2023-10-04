import {City} from "./city.enum";
import { HousingType } from "./housing-type.enum";
import { Facility } from "./facility-type.enum";
import { Coordinates } from "./coordinates.type";
import {User} from "./user.type";

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  preview: string;
  photos: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  facilities: Facility[];
  author: User;
  commentsCount: number;
  coordinates: Coordinates;
}
