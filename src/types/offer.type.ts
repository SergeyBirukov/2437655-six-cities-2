import { City } from './city.enum.js';
import { HousingType } from './housing-type.enum.js';
import { Facility } from './facility-type.enum.js';
import { Coordinates } from './coordinates.type.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  preview: string;
  photos: [
    string,
    string,
    string,
    string,
    string,
    string
  ];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsCount: number;
  guestsCount: number;
  price: number;
  facilities: Facility[];
  author: User;
  commentsCount: number;
  coordinates: Coordinates;
}
