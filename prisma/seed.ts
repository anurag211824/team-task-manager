import { PrismaClient, GlobalRole, TaskStatus, TaskPriority, ProjectRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Delete existing data
  await prisma.taskComment.deleteMany();
  await prisma.fileAttachment.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.projectInvite.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log("✓ Deleted existing data");

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: await bcrypt.hash("Admin@123456", 10),
      name: "Admin User",
      globalRole: GlobalRole.ADMIN,
      isEmailVerified: true,
    },
  });

  console.log("✓ Created admin user");

  // Create team members
  const member1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      password: await bcrypt.hash("Member@123456", 10),
      name: "John Doe",
      globalRole: GlobalRole.USER,
      isEmailVerified: true,
      bio: "Product Designer",
      timezone: "UTC",
    },
  });

  const member2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      password: await bcrypt.hash("Member@123456", 10),
      name: "Jane Smith",
      globalRole: GlobalRole.USER,
      isEmailVerified: true,
      bio: "Full Stack Developer",
      timezone: "UTC",
    },
  });

  console.log("✓ Created team members");

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: "Website Redesign",
      description: "Complete redesign of our marketing website",
      color: "#3b82f6",
      ownerId: adminUser.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Mobile App Development",
      description: "Building a new mobile application",
      color: "#8b5cf6",
      ownerId: adminUser.id,
    },
  });

  console.log("✓ Created projects");

  // Add project members
  await prisma.projectMember.createMany({
    data: [
      {
        projectId: project1.id,
        userId: member1.id,
        role: ProjectRole.ADMIN,
        canManageTasks: true,
        canManageMembers: true,
        canDelete: false,
        invitedBy: adminUser.id,
      },
      {
        projectId: project1.id,
        userId: member2.id,
        role: ProjectRole.MEMBER,
        canManageTasks: true,
        canManageMembers: false,
        canDelete: false,
        invitedBy: adminUser.id,
      },
      {
        projectId: project2.id,
        userId: member2.id,
        role: ProjectRole.ADMIN,
        canManageTasks: true,
        canManageMembers: true,
        canDelete: false,
        invitedBy: adminUser.id,
      },
    ],
  });

  console.log("✓ Added project members");

  // Create tags
  const tag1 = await prisma.tag.create({
    data: {
      name: "Frontend",
      color: "#ef4444",
      projectId: project1.id,
    },
  });

  const tag2 = await prisma.tag.create({
    data: {
      name: "Backend",
      color: "#3b82f6",
      projectId: project1.id,
    },
  });

  const tag3 = await prisma.tag.create({
    data: {
      name: "iOS",
      color: "#10b981",
      projectId: project2.id,
    },
  });

  console.log("✓ Created tags");

  // Create tasks for project 1
  const task1 = await prisma.task.create({
    data: {
      title: "Design Homepage Layout",
      description: "Create a modern, responsive homepage design",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: project1.id,
      creatorId: adminUser.id,
      assignedToId: member1.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      startDate: new Date(),
      estimatedHours: 16,
      progress: 60,
      tagIds: [tag1.id],
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Create Backend API",
      description: "Set up REST API with authentication",
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      projectId: project1.id,
      creatorId: adminUser.id,
      assignedToId: member2.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      estimatedHours: 32,
      tagIds: [tag2.id],
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "Setup Database",
      description: "Configure MongoDB and create schemas",
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.MEDIUM,
      projectId: project1.id,
      creatorId: adminUser.id,
      assignedToId: member2.id,
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      estimatedHours: 8,
      progress: 85,
      tagIds: [tag2.id],
    },
  });

  console.log("✓ Created tasks for project 1");

  // Create tasks for project 2
  const task4 = await prisma.task.create({
    data: {
      title: "Setup iOS Project",
      description: "Initialize Xcode project and configure CocoaPods",
      status: TaskStatus.DONE,
      priority: TaskPriority.MEDIUM,
      projectId: project2.id,
      creatorId: adminUser.id,
      assignedToId: member2.id,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      estimatedHours: 4,
      progress: 100,
      tagIds: [tag3.id],
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: "Implement Authentication",
      description: "Add login/signup functionality with OAuth",
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      projectId: project2.id,
      creatorId: adminUser.id,
      assignedToId: member2.id,
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      estimatedHours: 20,
      progress: 40,
      tagIds: [tag3.id],
    },
  });

  console.log("✓ Created tasks for project 2");

  // Create comments
  await prisma.taskComment.create({
    data: {
      content: "Great design! Looking forward to seeing this implemented.",
      taskId: task1.id,
      projectId: project1.id,
      authorId: member2.id,
    },
  });

  console.log("✓ Created comments");

  // Create notifications
  await prisma.notification.create({
    data: {
      type: "TASK_ASSIGNED",
      title: "Task Assigned",
      message: "You have been assigned a new task: Design Homepage Layout",
      userId: member1.id,
      projectId: project1.id,
      taskId: task1.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log("✓ Created notifications");

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
