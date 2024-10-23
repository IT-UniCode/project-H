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

  // Обробляємо пагінацію
  if (params.pagination) {
    if (params.pagination === "max") {
      queryObject["pagination[limit]"] = "max";
    } else {
      if (params.pagination.page) {
        queryObject["pagination[page]"] = params.pagination.page;
      }
      if (params.pagination.pageSize) {
        queryObject["pagination[pageSize]"] = params.pagination.pageSize;
      }
    }
  }

  // Обробляємо фільтри
  if (params.filters) {
    queryObject["filters[field]"] = params.filters.field;
    queryObject["filters[value]"] = params.filters.value;
  }

  // Додаємо інші параметри
  for (const key in params) {
    if (key !== "pagination" && key !== "filters") {
      queryObject[key] = params[key];
    }
  }

  // Перетворюємо об'єкт на query string
  return queryString.stringify(queryObject);
}

export default new ApiService();
