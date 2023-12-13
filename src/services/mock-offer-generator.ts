import { MockData } from '../types/mock-data.type.js';
import { generateRandomNumber, getRandomItem, getRandomItems } from './random-service.js';
import { City } from '../types/city.enum.js';
import { Facility } from '../types/facility-type.enum.js';
import { HousingType } from '../types/housing-type.enum.js';
import { UserType } from '../types/user-type.enum.js';
import dayjs from 'dayjs';
import { Offer } from '../types/offer.type.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const MIN_RATING = 0;
const MAX_RATING = 5;
const MIN_COUNT_ROOM = 1;
const MAX_COUNT_ROOM = 5;
const MIN_GUESTS_NUMBER = 1;
const MAX_GUESTS_NUMBER = 10;
const MIN_RENTAL_COST = 1000;
const MAX_RENTAL_COST = 1000000;

const getAllValuesFromEnum = (enumObject: object): string[] =>
  Object.values(enumObject).filter((value) => isNaN(Number(value)));

export const generateOffer = (mockData: MockData): string => {
  const name = getRandomItem<string>(mockData.titles);
  const description = getRandomItem<string>(mockData.descriptions);
  const publicationDate = dayjs().subtract(generateRandomNumber(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
  const city = getRandomItem(getAllValuesFromEnum(City));
  const previewImage = getRandomItem<string>(mockData.previewImages);
  const images = getRandomItems<string>(mockData.propertyImages);
  const premium = getRandomItem<string>(['true', 'false']);
  const favorite = getRandomItem<string>(['true', 'false']);
  const rating = generateRandomNumber(MIN_RATING, MAX_RATING, 1);
  const housingType = getRandomItem(getAllValuesFromEnum(HousingType));
  const roomCount = generateRandomNumber(MIN_COUNT_ROOM, MAX_COUNT_ROOM);
  const guestCount = generateRandomNumber(MIN_GUESTS_NUMBER, MAX_GUESTS_NUMBER);
  const price = generateRandomNumber(MIN_RENTAL_COST, MAX_RENTAL_COST);
  const facilities = getRandomItems(getAllValuesFromEnum(Facility));
  const offerAuthorName = getRandomItem<string>(mockData.users.names);
  const offerAuthorAvatar = getRandomItem<string>(mockData.users.avatars);
  const offerAuthorType = getRandomItem(getAllValuesFromEnum(UserType));
  const offerAuthorNameEmail = getRandomItem<string>(mockData.users.emails);
  const offerAuthorNamePassword = getRandomItem<string>(mockData.users.passwords);
  const commentsCount = generateRandomNumber(1, 10);
  const latitude = getRandomItem<number>(mockData.coordinates.latitude);
  const longitude = getRandomItem<number>(mockData.coordinates.longitude);

  return [
    name,
    description,
    publicationDate,
    city,
    previewImage,
    images,
    premium,
    favorite,
    rating,
    housingType,
    roomCount,
    guestCount,
    price,
    facilities,
    offerAuthorName,
    offerAuthorAvatar,
    offerAuthorType,
    offerAuthorNameEmail,
    offerAuthorNamePassword,
    commentsCount,
    latitude,
    longitude,
  ].join('\t');
};

export const parseOffer = (offerString: string): Offer => {
  const offerRow = offerString.split('\t');
  const [
    title,
    description,
    publicationDate,
    city,
    preview,
    images,
    premium,
    favorite,
    rating,
    housingType,
    roomCount,
    guestCount,
    facilities,
    authorName,
    authorAvatar,
    authorType,
    authorEmail,
    authorPassword,
    commentsCount,
    latitude,
    longitude,
    cost,
  ] = offerRow;
  return {
    title: title,
    description: description,
    postDate: new Date(publicationDate),
    city: city as unknown as City,
    preview: preview,
    photos: images.split(';') as [string,string,string,string,string, string],
    isPremium: premium as unknown as boolean,
    isFavorite: favorite as unknown as boolean,
    rating: parseFloat(rating),
    housingType: housingType as unknown as HousingType,
    roomsCount: parseInt(roomCount, 10),
    guestsCount: parseInt(guestCount, 10),
    price: parseInt(cost, 10),
    facilities: facilities.split(';').map((x) => x as unknown as Facility),
    author: {
      name: authorName,
      avatar: authorAvatar as `${string}.${'jpg' | 'png'}`,
      type: authorType as unknown as UserType,
      email: authorEmail as `${string}@${string}`,
      password: authorPassword,
    },
    commentsCount: parseInt(commentsCount, 10),
    coordinates: {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    },
  };
};
