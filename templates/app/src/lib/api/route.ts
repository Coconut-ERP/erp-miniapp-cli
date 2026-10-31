import type { UserDto } from "erp-sdk";
import type { NextRequest } from "next/server";
import type { AppErp } from "@/lib/erp/app";
import { getErp } from "@/lib/erp/app";
import { resolveUser } from "@/lib/erp/session";
import { errorResponse, unauthorized } from "./errors";

export const INIT_DATA_HEADER = "x-init-data";

export interface ErpContext {
  erp: AppErp;
  user: UserDto;
}

type ApiHandler<P> = (request: NextRequest, params: P) => Promise<unknown>;

type ErpHandler<P> = (context: ErpContext, request: NextRequest, params: P) => Promise<unknown>;

/** Seed / local demos without ERP identity. Prefer `withErp` for real data routes. */
export function withApi<P = unknown>(handler: ApiHandler<P>) {
  return async (request: NextRequest, routeContext: { params: Promise<P> }): Promise<Response> => {
    try {
      const data = await handler(request, await routeContext.params);
      return Response.json(data);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

async function identify(request: NextRequest): Promise<UserDto> {
  const initData = request.headers.get(INIT_DATA_HEADER);
  if (!initData) throw unauthorized("Missing initData — open the app from ERP");
  return resolveUser(initData);
}

async function contextFrom(request: NextRequest): Promise<ErpContext> {
  const user = await identify(request);
  const erp = await getErp();
  return { erp, user };
}

/**
 * App-authority contract: every call is identified via initData before it
 * touches ERP data. Failures return JSON the frontend can act on
 * (401 → ask the host for fresh initData and retry).
 */
export function withErp<P = unknown>(handler: ErpHandler<P>) {
  return async (request: NextRequest, routeContext: { params: Promise<P> }): Promise<Response> => {
    try {
      const context = await contextFrom(request);
      return Response.json(await handler(context, request, await routeContext.params));
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export async function parseJson<T = unknown>(request: NextRequest): Promise<T> {
  return (await request.json()) as T;
}
