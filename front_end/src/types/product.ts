export interface IProduct {
  _id: string;
  name: {
    en: string;
    fr: string;
    ar: string;
  };
  price: number;
  size: string;
  createdAt: string;
  updatedAt: string;
}
