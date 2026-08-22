import type {
  Method,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig
} from "axios";

export type resultType = {
  accessToken?: string;
};

/**
 * Unified backend success envelope: `{code, message, data}`.
 * `code === 0` means success. Use `ApiResponse<Payload>` instead of
 * re-declaring `{code, message, data}` in every api module.
 */
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  data: T;
}

/** Paginated payload shape used inside `ApiResponse`. */
export interface PageData<T = any> {
  list: T[];
  total?: number;
  pageSize?: number;
  currentPage?: number;
}

export type RequestMethods = Extract<
  Method,
  "get" | "post" | "put" | "delete" | "patch" | "option" | "head"
>;

export interface PureHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig;
}

export interface PureHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: PureHttpRequestConfig) => void;
  beforeResponseCallback?: (response: PureHttpResponse) => void;
}

export default class PureHttp {
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PureHttpRequestConfig
  ): Promise<T>;
  post<T, P>(
    url: string,
    params?: P,
    config?: PureHttpRequestConfig
  ): Promise<T>;
  get<T, P>(
    url: string,
    params?: P,
    config?: PureHttpRequestConfig
  ): Promise<T>;
}
