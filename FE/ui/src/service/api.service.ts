import type { ApiPath } from "@constant/api.path";
import queryString from "query-string";
import type { QueryApi } from "src/interfaces";

class ApiService {
  apiUrl = import.meta.env.PUBLIC_API_URL;

  async requst(
    path: string,
    method: "POST" | "GET" | "PUT" | "DELETE",
    init: {
      body?: any;
      headers?: any;
    },
  ): Promise<Response> {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${
        globalThis.window ? localStorage.getItem("access_token") : "none"
      }`,
      ...init.headers,
    };

    const res = await fetch(this.apiUrl + path, {
      method: method,
      headers,
      body: init.body,
    });

    if (!res.ok) {
      throw new Error(
        `API request failed ${path} : ${res.status} ${res.statusText}`,
      );
    }
    return res;
  }

  async post<T>(
    path: string | ApiPath,
    init: {
      body: any;
      headers?: any;
    },
  ): Promise<T> {
    const res = await this.requst(path, "POST", {
      ...init,
      body: JSON.stringify(init.body),
    });

    return await res.json();
  }

  async get<T>(
    path: string | ApiPath,
    init: {
      headers?: any;
      query?: any;
    } = {},
  ): Promise<T> {
    const query = convertToQueryString(init.query);
    const res = await this.requst(path + `?${query}`, "GET", init);

    return await res.json();
  }
}

function convertToQueryString(params: QueryApi): string {
  if (!params) return "";

  const queryObject: any = {};

  // Перетворюємо об'єкт на query string
  return queryString.stringify(params);
}

export default new ApiService();
