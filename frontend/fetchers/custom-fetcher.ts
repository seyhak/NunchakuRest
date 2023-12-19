import { convertKeysToCamelCase } from "@/utils/case-converters"
import { cookies } from "next/headers"

export type CustomFetcherProps = {
  init?: RequestInit;
  customNotOkErrorMsg?: string;
  customErrorMsg?: string;
};
export const customFetcher = async <DataType>(
  url: string,
  optional?: CustomFetcherProps
) => {
  optional
  try {
    const joinedHeaders = {
      ...optional?.init?.headers,
      cookie: cookies().toString(),
    }
    const response = await fetch(url, {
      ...optional?.init,
      headers: joinedHeaders,
    })
    if (!response.ok) {
      throw new Error(optional?.customNotOkErrorMsg || "Network response was not ok")
    }
    const data = await response.json()
    let parsedData: any
    if(Array.isArray(data)) {
      parsedData = data.map(row => convertKeysToCamelCase(row))
    } else {
      parsedData = convertKeysToCamelCase(data)
    }
    return parsedData as DataType
  } catch (error) {
    console.error("Error fetching data:", error)
  }
}
