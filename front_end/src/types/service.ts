export interface IService {
  _id: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  description: {
    en: string;
    fr: string;
    ar: string;
  };
  highPrice: number;
  lowPrice: number;
  image: string[]; // array of image URLs
  createdAt: string;
  updatedAt: string;
}
