import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
@Injectable()
export class RequestService {
  async request(
    path: string,
    method: 'POST' | 'GET' | 'PUT' | 'DELETE',
    init: {
      body?: any;
      headers?: any;
    },
  ): Promise<AxiosResponse<any, any>> {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
      ...init.headers,
    };

    try {
      const res = await axios(`${process.env.STRAPI_URL}${path}`, {
        method,
        data: init.body,
        headers,
      });

      return res;
    } catch (error) {
      throw new BadRequestException(error.request.res.statusMessage);
    }
  }

  async post<T>(
    path: string,
    init: {
      headers?: any;
      body: T;
    },
  ): Promise<any> {
    const res = await this.request(path, 'POST', {
      ...init,
      body: JSON.stringify(init.body),
    });

    return await res.data;
  }

  async get(
    path: string,
    init: {
      headers?: any;
    } = {},
  ) {
    const res = await this.request(path, 'GET', init);

    return await res.data;
  }

  async put<T>(
    path: string,
    init: {
      headers?: any;
      body?: T;
    } = {},
  ): Promise<any> {
    const res = await this.request(path, 'PUT', {
      ...init,
      body: JSON.stringify(init.body),
    });

    return res.status;
  }

  async delete(
    path: string,
    init: {
      headers?: any;
    } = {},
  ): Promise<number> {
    const res = await this.request(path, 'DELETE', init);

    return res.status;
  }
}
