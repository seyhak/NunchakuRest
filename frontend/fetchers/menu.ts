import { UUID } from "crypto";
import axiosInstance from "./axios";
import { DeliveryMethods, Order, OrderInOrdersDisplay, OrderProduct, PaymentMethods } from "@/types/menu";

type OrderMenuSetPayloadData = {
  amount: number
  id: UUID
  products: {id: UUID}[]
}

export type CreateOrderPayloadData = {
  menuSets: OrderMenuSetPayloadData[]
  products: OrderProduct[]
  paymentMethod?: typeof PaymentMethods[keyof typeof PaymentMethods]
  deliveryMethod?: typeof DeliveryMethods[keyof typeof DeliveryMethods]
}

export const createOrderFetcher = async (data: CreateOrderPayloadData
) => {
  const response = await axiosInstance.post("/api/orders/", data)
  return response.data as Order
}

export const getOrdersFetcher = async () => {
    const response = await axiosInstance.post("/api/orders/")
    return response.data as OrderInOrdersDisplay[]
  }

export const patchFinalizeOrder = async (id: UUID) => {
  const response = await axiosInstance.patch(`/api/orders/${id}/finish-order/`)
  return response.data as any
}