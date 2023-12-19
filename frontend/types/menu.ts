import { UUID } from "crypto"
import { Timestamped } from "./common"
import { ValuesOf } from "./global";

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
  id: UUID;
  categories: Category[];
  products: Product[];
  name: string;
  startDate: Date | null;
  endDate: Date | null;
} & Timestamped;

export type OrderedProduct = {
  name: string;
  price: string;
  id: UUID;
  amount: number;
};

export enum KioskPages {
  MENU,
  PAYMENT,
}
export type KioskPagesValues = ValuesOf<typeof KioskPages>

export type OrderProduct = {
  id: UUID
  amount: number
}

export enum PaymentMethods {
  CASH = "CS",
  BLIK = "BL"
}

export enum DeliveryMethods {
  HERE = "HR",
  TAKE_AWAY = "TA"
}

export type Order = {
  id: UUID;
  products: OrderProduct[]
  orderId: string
  paymentMethod: typeof PaymentMethods[keyof typeof PaymentMethods]
  isPaid: boolean
  deliveryMethod: typeof DeliveryMethods[keyof typeof DeliveryMethods]
  createdAt: Date
}

export type ProductInOrdersDisplay = {
  name: string
} & OrderProduct

export type OrderInOrdersDisplay = {
  products: ProductInOrdersDisplay[]
} & Order
