import { CreateTaskRequest, CreateProjectRequest, SignupRequest } from "@/types";

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateSignupRequest(
  req: SignupRequest
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!req.email || !validateEmail(req.email)) {
    errors.push("Invalid email format");
  }

  if (!req.name || req.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long");
  }

  const passwordValidation = validatePassword(req.password);
  if (!passwordValidation.valid) {
    errors.push(...passwordValidation.errors);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateProjectRequest(
  req: CreateProjectRequest
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!req.name || req.name.trim().length < 2) {
    errors.push("Project name must be at least 2 characters long");
  }

  if (req.name && req.name.length > 100) {
    errors.push("Project name must not exceed 100 characters");
  }

  if (req.description && req.description.length > 500) {
    errors.push("Project description must not exceed 500 characters");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateTaskRequest(
  req: CreateTaskRequest,
  projectId: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!req.title || req.title.trim().length < 2) {
    errors.push("Task title must be at least 2 characters long");
  }

  if (req.title && req.title.length > 200) {
    errors.push("Task title must not exceed 200 characters");
  }

  if (req.description && req.description.length > 2000) {
    errors.push("Task description must not exceed 2000 characters");
  }

  if (req.dueDate && new Date(req.dueDate) < new Date()) {
    errors.push("Due date must be in the future");
  }

  if (req.estimatedHours && req.estimatedHours <= 0) {
    errors.push("Estimated hours must be greater than 0");
  }

  if (!projectId) {
    errors.push("Project ID is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
