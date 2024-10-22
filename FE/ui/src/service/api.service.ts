class ApiService {
  apiUrl = import.meta.env.STRAPI_URL;

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

    console.log("ApiRequest", init.body, typeof init.body, this.apiUrl + path);
    const res = await fetch(this.apiUrl + path, {
      method: method,
      headers,
      body: init.body,
    });

    if (!res.ok) {
      throw new Error(`API request failed: ${res.status}`);
    }
    return res;
  }

  async post<T>(
    path: string,
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
    path: string,
    init: {
      headers?: any;
    } = {},
  ): Promise<T> {
    const res = await this.requst(path, "GET", init);

    return await res.json();
  }
}

export default new ApiService();
