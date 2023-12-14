import {
  convertKeysToSnakeCase,
  convertKeysToCamelCase,
} from "@/utils/case-converters"
import getCookie from "@/utils/get-cookie"
import axios, {
  AxiosInstance,
} from "axios"

const axiosInstance: AxiosInstance = axios.create()

axiosInstance.defaults.xsrfHeaderName = "X-CSRFToken"
axiosInstance.defaults.xsrfCookieName = "csrftoken"

// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
  if (config.headers) {
    if (config.method === "post" && config.headers) {
      const csrfToken = getCookie("csrftoken")
      const headers = {
        ...config.headers,
        "X-CSRFToken": csrfToken!,
        HTTP_X_CSRFTOKEN: csrfToken!,
      }
      config.headers = headers as any
      console.log({ config })
    }
  }
  if (config.data) {
    config.data = convertKeysToSnakeCase(config.data)
  }
  return config
})

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data) {
      // Convert snake_case keys to camelCase
      response.data = convertKeysToCamelCase(response.data)
    }
    return response
  },
  (error) => {
    // Handle response errors
    const status = error.response.status
    error.response.data = convertKeysToCamelCase(error.response.data)
    if (status === 500) {
      // console.error(err)
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
