import { prisma } from "./db";
import { ProjectRole, GlobalRole } from "@prisma/client";

export async function checkProjectAccess(
  userId: string,
  projectId: string,
  requiredRole?: ProjectRole
): Promise<boolean> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return false;

    // Owner always has access
    if (project.ownerId === userId) return true;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member) return false;

    if (!requiredRole) return true;

    // Check if user's role meets the requirement
    const roleHierarchy: Record<ProjectRole, number> = {
      VIEWER: 1,
      MEMBER: 2,
      ADMIN: 3,
      OWNER: 4,
    };

    return roleHierarchy[member.role] >= roleHierarchy[requiredRole];
  } catch (error) {
    console.error("Error checking project access:", error);
    return false;
  }
}

export async function checkTaskAccess(
  userId: string,
  taskId: string
): Promise<boolean> {
  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { project: true },
    });

    if (!task) return false;

    // Task creator and assignee have access
    if (task.creatorId === userId || task.assignedToId === userId) {
      return true;
    }

    // Check project membership
    return checkProjectAccess(userId, task.projectId);
  } catch (error) {
    console.error("Error checking task access:", error);
    return false;
  }
}

export async function canManageTasks(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return false;

    // Owner can manage
    if (project.ownerId === userId) return true;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member) return false;

    return member.canManageTasks || member.role === "ADMIN" || member.role === "OWNER";
  } catch (error) {
    console.error("Error checking task management permission:", error);
    return false;
  }
}

export async function canManageMembers(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return false;

    // Owner can manage
    if (project.ownerId === userId) return true;

    const member = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId } },
    });

    if (!member) return false;

    return (
      member.canManageMembers || member.role === "ADMIN" || member.role === "OWNER"
    );
  } catch (error) {
    console.error("Error checking member management permission:", error);
    return false;
  }
}

export async function canDeleteProject(
  userId: string,
  projectId: string
): Promise<boolean> {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) return false;

    // Only owner can delete
    return project.ownerId === userId;
  } catch (error) {
    console.error("Error checking project delete permission:", error);
    return false;
  }
}

export function isAdmin(role: GlobalRole): boolean {
  return role === GlobalRole.SUPER_ADMIN || role === GlobalRole.ADMIN;
}

export function isSuperAdmin(role: GlobalRole): boolean {
  return role === GlobalRole.SUPER_ADMIN;
}
