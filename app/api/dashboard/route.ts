import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticate, success, serverError, unauthorized } from "@/lib/auth-middleware";
import { TaskStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = await authenticate(request);
    if (!user) {
      return unauthorized();
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    let dashboardData = {};

    if (projectId) {
      // Project-specific dashboard
      const [taskStats, recentTasks, overdueTasks, teamStats] = await Promise.all([
        // Task statistics
        prisma.task.groupBy({
          by: ["status"],
          where: { projectId },
          _count: { id: true },
        }),
        // Recent tasks
        prisma.task.findMany({
          where: { projectId },
          include: {
            assignedTo: { select: { name: true } },
            creator: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
        // Overdue tasks
        prisma.task.findMany({
          where: {
            projectId,
            dueDate: { lt: new Date() },
            status: { not: TaskStatus.DONE },
          },
          include: {
            assignedTo: { select: { name: true } },
          },
        }),
        // Team statistics
        prisma.projectMember.findMany({
          where: { projectId },
          include: {
            user: { select: { name: true, avatar: true } },
          },
        }),
      ]);

      dashboardData = {
        taskStats: taskStats.map((stat) => ({
          status: stat.status,
          count: stat._count.id,
        })),
        recentTasks,
        overdueTasks,
        teamMembers: teamStats,
        totalTasks: await prisma.task.count({ where: { projectId } }),
        completedTasks: await prisma.task.count({
          where: { projectId, status: TaskStatus.DONE },
        }),
      };
    } else {
      // User's personal dashboard
      const [assignedToMe, myProjects, myOverdueTasks, recentActivity] = await Promise.all([
        // Tasks assigned to user
        prisma.task.findMany({
          where: {
            assignedToId: user.userId,
            status: { not: TaskStatus.DONE },
          },
          include: {
            project: { select: { id: true, name: true } },
            assignedTo: { select: { name: true } },
          },
          orderBy: { dueDate: "asc" },
          take: 10,
        }),
        // User's projects
        prisma.project.findMany({
          where: {
            OR: [
              { ownerId: user.userId },
              { members: { some: { userId: user.userId } } },
            ],
          },
          include: {
            _count: { select: { tasks: true, members: true } },
          },
          take: 10,
        }),
        // Overdue tasks assigned to user
        prisma.task.findMany({
          where: {
            assignedToId: user.userId,
            dueDate: { lt: new Date() },
            status: { not: TaskStatus.DONE },
          },
          include: {
            project: { select: { name: true } },
          },
        }),
        // Recent activity
        prisma.activity.findMany({
          where: {
            project: {
              OR: [
                { ownerId: user.userId },
                { members: { some: { userId: user.userId } } },
              ],
            },
          },
          include: {
            user: { select: { name: true } },
            project: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        }),
      ]);

      dashboardData = {
        assignedTasks: assignedToMe,
        projects: myProjects,
        overdueTasks: myOverdueTasks,
        recentActivity,
        totalProjects: await prisma.project.count({
          where: {
            OR: [
              { ownerId: user.userId },
              { members: { some: { userId: user.userId } } },
            ],
          },
        }),
        totalAssignedTasks: await prisma.task.count({
          where: { assignedToId: user.userId },
        }),
        completedTasks: await prisma.task.count({
          where: {
            assignedToId: user.userId,
            status: TaskStatus.DONE,
          },
        }),
      };
    }

    return success(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return serverError("Failed to fetch dashboard data");
  }
}
