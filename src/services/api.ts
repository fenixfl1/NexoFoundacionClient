/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosRequestHeaders } from 'axios'
import { BASE_API_PATH, PATH_LOGIN } from 'src/constants/routes'
import { getSessionToken } from 'src/lib/session'
import { publicRoutes } from 'src/routes/auto-routes'
import { Metadata } from 'src/types/general'

export interface ApiResponse<T> {
  data: {
    data: T
    metadata: { pagination: Metadata }
    message: string
  }
  error?: AxiosError
}

export const api = axios.create({
  baseURL: BASE_API_PATH,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getSessionToken()
    const isPublic = publicRoutes.some(
      (route) => route.path === window.location.pathname
    )

    if (token && !isPublic) {
      config.headers = config.headers ?? <AxiosRequestHeaders>{}
      config.headers.Authorization = token
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAlreadyOnLogin = window.location.pathname.startsWith(PATH_LOGIN)
      if (!isAlreadyOnLogin) {
        const currentPath =
          window.location.pathname +
          window.location.search +
          window.location.hash
        const next = encodeURIComponent(currentPath || '/')
        if (next === '/') {
          window.location.href = PATH_LOGIN
        } else {
          window.location.href = `${PATH_LOGIN}?next=${next}`
        }
      }
    }

    return Promise.reject(error)
  }
)

export const postRequest = async <T, TData = unknown>(
  url: string,
  data: TData
): Promise<ApiResponse<T>> => {
  return api.post(url, data)
}

export const putRequest = async <T, TData = unknown>(
  url: string,
  data: TData
): Promise<ApiResponse<T>> => {
  return api.put(url, data)
}

export const getRequest = async <T>(
  url: string,
  ...args: any[]
): Promise<ApiResponse<T>> => {
  if (args) {
    url += args.join('/')
  }
  return api.get(url)
}

type QueryParams = Record<string, string | number | boolean | null | undefined>

export function buildQueryString(
  baseUrl: string,
  ...params: (QueryParams | undefined | null)[]
): string {
  const query = params
    .filter(Boolean)
    .flatMap((obj) =>
      Object.entries(obj!).flatMap(([key, value]) =>
        Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]
      )
    )
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join('&')

  return query ? `${baseUrl}?${query}` : baseUrl
}

export function getQueryString(
  baseUrl: string,
  params: Record<string, unknown> = {}
): string {
  const values: string[] = []
  Object.entries(params).forEach(([key, value]) => {
    values.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
  })

  const query = values.join('&')

  return query ? `${baseUrl}?${query}` : baseUrl
}
