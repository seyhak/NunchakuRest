import { NamedUUID } from "./common";
import { ValuesOf } from "./global";
import { OrderedProduct, Product } from "./menu";

export type OrderedState<T> = {
  [key: string]: T;
} | null;
export type OrderedProductsState = OrderedState<OrderedProduct>

type OrderedMenuSetStateValue = {
  products: Product[]
  amount: number
} & NamedUUID

export type OrderedMenuSetsState = OrderedState<OrderedMenuSetStateValue>

export enum KioskPages {
  MENU,
  PAYMENT,
}
export type KioskPagesValues = ValuesOf<typeof KioskPages>;
