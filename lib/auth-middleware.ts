import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth/jwt";
import { JwtPayload } from "@/types";

export interface AuthenticatedRequest extends NextRequest {
  user?: JwtPayload;
}

export async function authenticate(request: NextRequest): Promise<JwtPayload | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    if (!payload) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Unauthorized. Please provide a valid token.",
      },
    },
    { status: 401 }
  );
}

export function forbidden() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "FORBIDDEN",
        message: "Forbidden. You do not have permission to access this resource.",
      },
    },
    { status: 403 }
  );
}

export function notFound() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: "Resource not found.",
      },
    },
    { status: 404 }
  );
}

export function badRequest(message: string = "Bad request") {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "BAD_REQUEST",
        message,
      },
    },
    { status: 400 }
  );
}

export function serverError(message: string = "Internal server error") {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    },
    { status: 500 }
  );
}

export function success<T>(data: T, message?: string, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}
