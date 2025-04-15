/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";
import { Api } from "./Api";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  // Holds the ongoing refresh promise (if any)
  private refreshTokenPromise: Promise<string> | null = null;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: "https://librairy.p-e.kr",
      withCredentials: true,
    });

    //jwt 추가
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // 응답 인터셉터: 401 발생 시 토큰 갱신 처리
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // `originalRequest`가 없거나 `_retry`가 이미 설정되었으면 종료
        if (!originalRequest || originalRequest._retry) {
          return Promise.reject(error);
        }
        // IMPORTANT: Exclude the refresh endpoint from this interceptor.
        if (originalRequest.url && originalRequest.url.includes("/api/token")) {
          // If the refresh endpoint itself fails, do not attempt another refresh.
          return Promise.reject(error);
        }
        if (error.response?.status === 401) {
          console.log("Access Token 만료, 새로운 토큰 요청");
          originalRequest._retry = true; // 리트라이 방지 플래그

          try {
            // If no refresh is in progress, start one.
            if (!this.refreshTokenPromise) {
              this.refreshTokenPromise = (async () => {
                const api = new Api();
                // Call the refresh endpoint; refresh token is sent via HttpOnly cookie.
                const refreshResponse = await api.validateRefreshToken();

                // Extract new access token from response headers.
                const newAccessToken =
                  refreshResponse.headers["authorization"]?.split("Bearer ")[1];

                if (!newAccessToken) {
                  throw new Error("새로운 Access Token을 찾을 수 없음");
                }

                // Store and update the new token.
                localStorage.setItem("token", newAccessToken);
                this.instance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

                return newAccessToken;
              })();
            }

            // Wait for the refresh token promise to resolve.
            const newAccessToken = await this.refreshTokenPromise;

            // Update the original request's header and retry it.
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.instance(originalRequest);
          } catch (refreshError) {
            console.error("토큰 갱신 실패:", refreshError);
            return this.logoutAndRedirect();
          } finally {
            // Clear the refresh promise after it settles.
            this.refreshTokenPromise = null;
          }
        }

        return Promise.reject(error);
      }
    );

    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  // 로그아웃 및 헤더 초기화 후 로그인 페이지 이동
  logoutAndRedirect = () => {
    localStorage.clear();
    delete this.instance.defaults.headers.Authorization;
    console.log("로그아웃되었습니다.");
    window.location.replace("/login");
  };

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem)
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body instanceof FormData) {
    } else if (
      type === ContentType.Json &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type === ContentType.FormData ? {} : { "Content-Type": type }), // Let Axios set the correct boundary
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}
