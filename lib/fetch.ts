import Cookies from "js-cookie";
import qs from "qs";
import { ApiError } from "./error/api-error";

interface FetchWithTokenProps {
  url: string;
  params?: Record<string, unknown>;
  options?: RequestInit;
}

export const fetchWithToken = async ({
  url,
  params,
  options,
}: FetchWithTokenProps) => {
  const token = Cookies.get("token");

  const queryString = params ? `?${qs.stringify(params)}` : "";

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...(options && options.headers ? options.headers : {}),
  };

  // Check if the body is FormData
  if (options?.body instanceof FormData) {
    // Type assertion to ensure headers is treated as a record
    if ((headers as Record<string, string>)["Content-Type"]) {
      delete (headers as Record<string, string>)["Content-Type"];
    }
  } else {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const response = await fetch(url + queryString, {
    ...options,
    headers,
    body: options?.body,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new ApiError(response.status, data?.error || "An error occurred");
  }

  return response;
};
