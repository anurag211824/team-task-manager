import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword} from "@/lib/auth/password";
import { generateToken } from "@/lib/auth/jwt";
import { validateSignupRequest} from "@/lib/validations";
import { badRequest, success, serverError } from "@/lib/auth-middleware";
import { SignupRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SignupRequest;

    // Validation
    const validation = validateSignupRequest(body);
    if (!validation.valid) {
      return badRequest(validation.errors.join(", "));
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return badRequest("Email already registered");
    }

    // Hash password
    const hashedPassword = await hashPassword(body.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.globalRole,
    });

    return success(
      {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.globalRole,
        },
      },
      "User created successfully",
      201
    );
  } catch (error) {
    console.error("Signup error:", error);
    return serverError("Failed to create user");
  }
}
