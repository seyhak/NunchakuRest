import { UUID } from "crypto"
import { Timestamped, NamedUUID } from "./common"
import { ValuesOf } from "./global"

export type Product = {
  price: string; // double
} & Timestamped &
  NamedUUID;

export type MenuSetStep = {
  name: string;
  products: Product[];
};

export type MenuSet = {
  setSteps: MenuSetStep[];
} & NamedUUID;

export type Category = {
  subCategories: Category[];
  products: Product[];
} & Timestamped &
  NamedUUID;

export type Menu = {
  categories: Category[];
  products: Product[];
  menuSets: MenuSet[]
  startDate: Date | null;
  endDate: Date | null;
} & Timestamped &
  NamedUUID;

export type OrderedProduct = {
  price: string;
  amount: number;
} &
  NamedUUID;

export type OrderProduct = {
  id: UUID;
  amount: number;
};

export enum PaymentMethods {
  CASH = "CS",
  BLIK = "BL",
}

export enum DeliveryMethods {
  HERE = "HR",
  TAKE_AWAY = "TA",
}

export type Order = {
  id: UUID;
  products: OrderProduct[];
  orderId: string;
  paymentMethod: (typeof PaymentMethods)[keyof typeof PaymentMethods];
  isPaid: boolean;
  deliveryMethod: (typeof DeliveryMethods)[keyof typeof DeliveryMethods];
  createdAt: Date;
};

export type ProductInOrdersDisplay = {
  name: string;
} & OrderProduct;

export type MenuSetInOrdersDisplay = {
  name: string;
  products: string
} & OrderProduct;

export type OrderInOrdersDisplay = {
  products: ProductInOrdersDisplay[];
  menuSets: MenuSetInOrdersDisplay[];
} & Order;

export type OrderedMenuSet = {
  price: string;
  amount: number;
} &
  NamedUUID;