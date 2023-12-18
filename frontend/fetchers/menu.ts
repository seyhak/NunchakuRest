import { UUID } from "crypto";
import axiosInstance from "./axios";
import { DeliveryMethods, Order, PaymentMethods } from "@/types/menu";


type OrderProduct = {
  id: UUID
  amount: number
}

export type CreateOrderPayloadData = {
  products: OrderProduct[]
  paymentMethod?: typeof PaymentMethods[keyof typeof PaymentMethods]
  deliveryMethod?: typeof DeliveryMethods[keyof typeof DeliveryMethods]
}

export const createOrderFetcher = async (data: CreateOrderPayloadData
) => {
  const response = await axiosInstance.post("/api/orders/", data)
  return response.data as Order
}
