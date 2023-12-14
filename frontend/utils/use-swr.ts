import React from "react"
import axios from "axios"
import useSWR, { Fetcher, SWRConfiguration } from "swr"
import { convertKeysToCamelCase } from "./case-converters"
import getCookie from "./get-cookie"
import axiosInstance from "@/fetchers/axios"

export const usrFetcher = async (url: string) => {
  const response = await axiosInstance.get(url)
  return response.data
}

export const useCustomSWR = <ResponseData>(
  url: string,
  options?: SWRConfiguration<ResponseData>
) => {
  const { mutate, ...swr } = useSWR<ResponseData>(url, usrFetcher, options)

  const refreshData = React.useCallback(
    async () => {
      const newData = await usrFetcher(url)
      mutate(newData, false)
    },
    [mutate, url]
  )

  return { refreshData, ...swr }
}

// const decorateFetcher =
//   <T, FetchBody>(fetcher: (body: FetchBody) => Promise<T>) =>
//   async (body: FetchBody): Promise<T> => {
//     // const csrfToken = getCookie("csrftoken")
//     // const headers = {
//     //   "Content-Type": "application/json",
//     //   "X-CSRFToken": csrfToken!,
//     //   ...init?.headers
//     // }
//     if (!fetcher) {
//       return null as T
//     }
//     const responseData = await fetcher(body)
//     return convertKeysToCamelCase(responseData as any) as T
//   }

// const useCustomSWR = <ResponseData, FetchBody>(
//   fetcher: (body: FetchBody) => Promise<ResponseData>,
//   options?: SWRConfiguration<ResponseData>
// ) => {
//   // const wrappedFetcher = decorateFetcher<ResponseData, FetchBody>(fetcher)
//   console.log({options})
//   const wrappedFetcher = React.useMemo(() => {
//     return decorateFetcher<ResponseData, FetchBody>(fetcher)
//   }, [fetcher])

//   console.log({ wrappedFetcher })
//   const { mutate, ...swr } = useSWR<ResponseData>(wrappedFetcher.toString(), wrappedFetcher, options)

//   console.log({ swr })
//   const refreshData = React.useCallback(
//     async (body: FetchBody) => {
//       const newData = await wrappedFetcher(body)
//       mutate(newData, false)
//     },
//     [mutate, wrappedFetcher]
//   )

//   return { refreshData, ...swr }
// }

