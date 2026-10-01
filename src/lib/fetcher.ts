import { apiClient } from "./axios";
import { AxiosRequestConfig } from "axios";

export class FetchError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Fetch wrapper backed by Axios for seamless backward-compatibility and typing
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method || "GET").toLowerCase();
  let bodyData: unknown = undefined;

  if (options.body && typeof options.body === "string") {
    try {
      bodyData = JSON.parse(options.body);
    } catch {
      bodyData = options.body;
    }
  }

  const config: AxiosRequestConfig = {
    url: endpoint,
    method,
    data: bodyData,
    headers: (options.headers as Record<string, string>) || {},
  };

  try {
    const data = (await apiClient.request(config)) as T;
    return data;
  } catch (err: unknown) {
    const axiosErr = err as { response?: { status?: number; data?: unknown }; message?: string };
    const status = axiosErr.response?.status || 500;
    const msg = (axiosErr.response?.data as { message?: string })?.message || axiosErr.message || "Network Error";
    throw new FetchError(msg, status, axiosErr.response?.data);
  }
}
