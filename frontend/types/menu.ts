import { UUID } from "crypto"
import { Timestamped } from "./common"

export type Product = {
  id: UUID;
  name: string;
  price: string; // double
} & Timestamped;

export type Category = {
  id: UUID;
  name: string;
  subCategories: Category[];
  products: Product[];
} & Timestamped;

export type Menu = {
  id: "ab362715-3a2f-48d8-82ac-b028ac101880";
  categories: Category[];
  products: Product[];
  name: string;
  startDate: Date | null;
  endDate: Date | null;
} & Timestamped;

export type OrderedProduct = {
  name: string;
  price: string;
  amount: number;
};

export enum KioskPages {
  MENU,
  PAYMENT,
}
