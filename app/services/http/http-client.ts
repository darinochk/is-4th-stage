import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { useUserStore } from "@/context/user-store";

const BACK_URL = "http://localhost:8080/";

export interface ApiMessage {
  message: string;
  isError: boolean;
}

class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BACK_URL,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor для добавления токена авторизации
    this.client.interceptors.request.use(
      (config: any) => {
        const token = useUserStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url, config);
    return response.data;
  }

  handleError(error: any, setError?: (err: ApiMessage) => void): void {
    if (error.code === 403) {
      useUserStore.getState().Logout();
    }

    if (setError) {
      const message = error.response?.data || error.message || "Произошла ошибка";
      setError({
        isError: true,
        message: typeof message === "string" ? message : JSON.stringify(message),
      });
    }
  }
}

export const httpClient = new HttpClient();
