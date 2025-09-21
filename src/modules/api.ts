import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
  AxiosHeaderValue,
} from "axios";
export type ApiSuccess = "OK" | "FAIL";
export interface ApiErrorBase {
  msg: string;
  cod: number;
  data?: unknown;
}

export type E = ApiErrorBase;

export interface ApiResponse<D = unknown> {
  success: ApiSuccess;
  data?: D;
  err?: E;
  // 서버가 error 키로 내려보내는 경우 대비 (하위호환)
  error?: unknown;
}

export const BASE_URL = import.meta.env.VITE_EXPRESS_API;
export const REFRESH_URL = import.meta.env.VITE_REFRESH_API;
export const TIMEOUT = Number(import.meta.env.VITE_TIMEOUT_API);

let promiseQueue: AxiosRequestConfig[] = [];
let isUpdatingToken = false;

export const getAccessToken = () => {
  return window.localStorage.getItem("accessToken");
};
export const getRefreshToken = () => {
  return window.localStorage.getItem("refreshToken");
};
export const getTokens = () => {
  return {
    accessToken: window.localStorage.getItem("accessToken"),
    refreshToken: window.localStorage.get("refreshToken"),
  };
};
export const setTokens = (accessToken: string, refreshToken: string) => {
  window.localStorage.setItem("accessToken", accessToken);
  window.localStorage.setItem("refreshToken", refreshToken);
};
export const clearTokens = () => {
  window.localStorage.removeItem("accessToken");
  window.localStorage.removeItem("refreshToken");
};

export const retrieveToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    window.dispatchEvent(
      new CustomEvent("Error_API", {
        detail: { cod: 403, msg: "리플레쉬 토큰 오류" },
      })
    );
  } else {
    const rs = await apiPost<
      { refreshToken: string },
      { accessToken: string; refreshToken: string }
    >("/public/refresh", { refreshToken });
    if (rs?.success === "OK") {
      setTokens(rs?.data?.accessToken || "", rs?.data?.refreshToken || "");
      return true;
    }
  }
  return false;
};

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
});
instance.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    const isPublic = url.toUpperCase().includes("PUBLIC");
    if (!isPublic) {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.headers.withCredentials = true;
      }
    }
    if (config.method?.toUpperCase() === "FILE") {
      config.headers["Content-Type"] = "multipart/form-data";
      config.method = "POST";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (err) => {
    window.dispatchEvent(
      new CustomEvent("Error_API", {
        detail: { cod: 403, msg: "API 요청 오류", err },
      })
    );
    return Promise.reject(null);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (response.data?.success === "FAIL" && response.data?.error) {
      const { cod, msg, data } = response.data?.error || {};
      window.dispatchEvent(
        new CustomEvent("Error_BIZ", {
          detail: { cod, msg, data },
        })
      );
      return null;
    }
    return response?.data || null;
  },
  async (err) => {
    if (err?.state === 401) {
      console.log(">>>리플래쉬 토큰 갱신 요청 합니다.<<<");
      if (!isUpdatingToken) {
        if (await retrieveToken()) {
          promiseQueue.forEach((config) => instance(config));
          isUpdatingToken = false;
          promiseQueue.length = 0;
        } else {
          promiseQueue.push(err.config);
        }
      }
    } else {
      console.log(err);
      const { cod, msg, data } = err?.response?.data?.error || {};
      window.dispatchEvent(
        new CustomEvent("Error_API", {
          detail: { cod, msg, data },
        })
      );
    }
    return Promise.reject(null);
  }
);
const api = async (url: string, params = null) => {
  const response = await instance({
    method: "GET",
    url,
    params,
  });
  return response || null;
};
const apiPost = async <T = unknown, D = unknown>(
  url: string,
  data: T | null = null,
  config?: AxiosRequestConfig
): Promise<ApiResponse<D> | null> => {
  const response = await instance.post<
    ApiResponse<D>,
    AxiosResponse<ApiResponse<D>>,
    T | null
  >(url, data, config);
  // console.log(response);
  return response || null;
};
// const apiPost = async (url: string, params: {}) => {
//   const response:AxiosResponse<myresponse> = await instance({
//     method: "POST",
//     url,
//     params,
//   });
//   return response || null;
// };
const apiFile = async (url: string, data: FormData) => {
  const response = await instance({
    method: "FILE",
    url,
    data,
  });
  return response || null;
};

export { api, apiPost, apiFile };
