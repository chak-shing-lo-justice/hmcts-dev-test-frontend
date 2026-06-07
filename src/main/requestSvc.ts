import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';

export const BASE_URL = process.env.BASE_URL || 'http://localhost:4000';
export const FRONT_BASE_URL = process.env.FRONT_BASE_URL || 'https://localhost:3100';

export async function doGet(req:Request, url: string, data?: any, headers?: any): Promise<AxiosResponse> {
  const queryUrl = new URL(url, BASE_URL);
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      queryUrl.searchParams.append(key, value as string);
    });
  }

  return axios.get(queryUrl.toString(), { headers: { ...headers, ...getAuthorizationHeader(req) } });
}

export async function doPost(req:Request, url: string, data: any, headers?: any): Promise<AxiosResponse> {
  return axios.post(new URL(url, BASE_URL).toString(), data,  { headers: { ...headers, ...getAuthorizationHeader(req) } });
}

export async function doPut(req:Request, url: string, data: any, headers?: any): Promise<AxiosResponse> {
  return axios.put(new URL(url, BASE_URL).toString(), data,  { headers: { ...headers, ...getAuthorizationHeader(req) } });
}

export async function doDelete(req:Request, url: string, data?: any, headers?: any): Promise<AxiosResponse> {
  return axios.delete(new URL(url, BASE_URL).toString(), { headers: { ...headers, ...getAuthorizationHeader(req) } });
}

function getAuthorizationHeader(req: Request): { Authorization: string }{
  return { Authorization : `Bearer ${req?.cookies?.token}` };
}
