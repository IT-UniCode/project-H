import type { ApiPath } from "@constant/api.path";
import { storageName } from "@constant/storageName";
import { useLocalStorage } from "@helpers/index";

import queryString from "query-string";
import type { QueryApi } from "src/interfaces";

class ApiService {
  apiUrl = import.meta.env.PUBLIC_API_URL;

  async request(
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
        globalThis.window
          ? useLocalStorage(storageName.AccessToken).get() || ""
          : ""
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
    const res = await this.request(path, "POST", {
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
    const res = await this.request(path + query, "GET", init);

    return await res.json();
  }

  async delete<T>(
    path: string | ApiPath,
    init: {
      headers?: any;
      query?: any;
    } = {},
  ): Promise<T> {
    const query = convertToQueryString(init.query);
    const res = await this.request(path + query, "DELETE", init);

    return await res.json();
  }
}

function convertToQueryString(params: QueryApi): string {
  if (!params) return "";

  const query = queryString.stringify(params);
  return query ? `?${query}` : "";
}

export default new ApiService();
