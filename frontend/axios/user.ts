import { User } from "@/types/user"
import axiosInstance from "./axios"


export const loginFetcher = async (data: {
  username: string,
  password: string
}) => {
  const response = await axiosInstance.post("/api/login/", data)
  return response.data as User
}

export const logoutFetcher = async () => {
  const response = await axiosInstance.post("/api/logout/")
  return response.data
}

export const signUpFetcher = async (data: {
  password: string;
} & User
) => {
  const response = await axiosInstance.post("/api/signup/", data)
  return response.data as User
}
