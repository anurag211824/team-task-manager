import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword } from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/jwt";
import { validateEmail } from "@/lib/validations";
import { badRequest, success, serverError} from "@/lib/auth-middleware";
import { AuthRequest } from "@/types";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AuthRequest;

    // Validation
    if (!body.email || !validateEmail(body.email)) {
      return badRequest("Invalid email format");
    }

    if (!body.password) {
      return badRequest("Password is required");
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return badRequest("Invalid email or password");
    }

    // Compare password
    const isPasswordValid = await comparePassword(body.password, user.password);
    if (!isPasswordValid) {
      return badRequest("Invalid email or password");
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.globalRole,
    });

    return success({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.globalRole,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return serverError("Failed to login");
  }
}
