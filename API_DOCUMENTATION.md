# Team Task Manager - API Documentation

## Overview

This is a comprehensive task management system built with Next.js, Prisma, and MongoDB. It supports role-based access control, team collaboration, task tracking, and project management.

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd team-task-manager
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env.local
```

Update `.env.local` with your MongoDB connection string and JWT secret:
```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/team-task-manager"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRY="7d"
```

4. Setup database
```bash
# Push schema to MongoDB
npm run db:push

# Seed sample data
npm run db:seed
```

5. Run development server
```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Database Schema

### Core Models

#### **User**
- Global roles: SUPER_ADMIN, ADMIN, USER
- Email verification
- Profile customization (avatar, bio, timezone)
- Activity tracking (login history)

#### **Project**
- Owned by a user
- Public/Private visibility
- Can be archived
- Customizable color/icon
- Tracks task and completion counts

#### **ProjectMember**
- Links users to projects with specific roles
- Roles: OWNER, ADMIN, MEMBER, VIEWER
- Granular permissions (canManageTasks, canManageMembers, canDelete)

#### **Task**
- Status tracking: TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED
- Priority levels: LOW, MEDIUM, HIGH, URGENT
- Supports subtasks (parent-child relationships)
- Progress tracking (0-100%)
- Time estimation and tracking
- Multiple tags and file attachments

#### **TaskComment**
- Nested comments (replies)
- File attachments
- Edit tracking
- Author information

#### **Tag**
- Project-scoped tags for organization
- Colorizable for visual categorization

#### **Activity**
- Audit trail for all changes
- Tracks: CREATED, UPDATED, DELETED, STATUS_CHANGED, ASSIGNED, COMMENTED, ATTACHED_FILE
- Stores change history (before/after)

#### **Notification**
- Multiple types: TASK_ASSIGNED, TASK_UPDATED, COMMENT_ADDED, etc.
- User-specific with 30-day expiration
- Read status tracking

#### **FileAttachment**
- Attachments for tasks, comments, and projects
- File size and type tracking
- Upload tracking

#### **ProjectInvite**
- Email-based invitations
- Token-based acceptance
- Role assignment during invitation

---

## API Endpoints

### Authentication

#### **POST** `/api/auth/signup`
Create a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    }
  }
}
```

#### **POST** `/api/auth/login`
Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

---

### Projects

#### **GET** `/api/projects`
Get all projects for authenticated user (as owner or member).

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "project-id",
      "name": "Website Redesign",
      "description": "...",
      "color": "#3b82f6",
      "ownerId": "user-id",
      "isPublic": true,
      "archived": false,
      "createdAt": "2024-01-01T00:00:00Z",
      "_count": {
        "members": 5,
        "tasks": 12
      }
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

#### **POST** `/api/projects`
Create a new project (creator becomes owner).

**Request:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "color": "#3b82f6",
  "isPublic": false
}
```

#### **GET** `/api/projects/{id}`
Get project details with members and metadata.

#### **PUT** `/api/projects/{id}`
Update project information (requires access).

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "archived": false
}
```

#### **DELETE** `/api/projects/{id}`
Delete project (owner only). Cascades to all tasks and comments.

---

### Project Members

#### **GET** `/api/projects/{id}/members`
Get all project members with their roles.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "member-id",
      "userId": "user-id",
      "role": "ADMIN",
      "canManageTasks": true,
      "canManageMembers": true,
      "canDelete": false,
      "joinedAt": "2024-01-01T00:00:00Z",
      "user": {
        "id": "user-id",
        "name": "John Doe",
        "email": "john@example.com",
        "avatar": "..."
      }
    }
  ]
}
```

#### **POST** `/api/projects/{id}/members`
Add a member to project (requires manage permission).

**Request:**
```json
{
  "userId": "user-id",
  "role": "MEMBER",
  "canManageTasks": true,
  "canManageMembers": false,
  "canDelete": false
}
```

#### **PUT** `/api/projects/{id}/members/{memberId}`
Update member role and permissions.

**Request:**
```json
{
  "role": "ADMIN",
  "canManageTasks": true,
  "canManageMembers": true
}
```

#### **DELETE** `/api/projects/{id}/members/{memberId}`
Remove member from project.

---

### Tasks

#### **GET** `/api/tasks`
Get tasks for a project with filtering.

**Query Parameters:**
- `projectId` (required)
- `status` (optional: TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED)
- `assignedToId` (optional)
- `priority` (optional: LOW, MEDIUM, HIGH, URGENT)
- `page` (default: 1)
- `limit` (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "task-id",
      "title": "Task Title",
      "description": "...",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2024-01-15T00:00:00Z",
      "startDate": "2024-01-01T00:00:00Z",
      "progress": 50,
      "estimatedHours": 8,
      "creatorId": "user-id",
      "assignedToId": "user-id",
      "projectId": "project-id",
      "createdAt": "2024-01-01T00:00:00Z",
      "_count": {
        "comments": 3,
        "subtasks": 2
      },
      "creator": { "id": "...", "name": "..." },
      "assignedTo": { "id": "...", "name": "..." },
      "tags": [...]
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20,
  "totalPages": 3
}
```

#### **POST** `/api/tasks`
Create a new task in a project.

**Request:**
```json
{
  "projectId": "project-id",
  "title": "New Task",
  "description": "Task description",
  "priority": "HIGH",
  "status": "TODO",
  "dueDate": "2024-01-15T00:00:00Z",
  "startDate": "2024-01-01T00:00:00Z",
  "assignedToId": "user-id",
  "tags": ["tag-id-1", "tag-id-2"],
  "estimatedHours": 8,
  "parentTaskId": null
}
```

#### **GET** `/api/tasks/{id}`
Get full task details with comments and attachments.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "task-id",
    "title": "Task Title",
    "...": "...",
    "comments": [
      {
        "id": "comment-id",
        "content": "Comment text",
        "author": { "id": "...", "name": "...", "avatar": "..." },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "attachments": [...]
  }
}
```

#### **PUT** `/api/tasks/{id}`
Update task details (can update by assignee or project member).

**Request:**
```json
{
  "title": "Updated Title",
  "status": "IN_PROGRESS",
  "priority": "MEDIUM",
  "progress": 75,
  "assignedToId": "new-user-id"
}
```

#### **DELETE** `/api/tasks/{id}`
Delete task (creator or project admin only).

---

### Task Comments

#### **POST** `/api/tasks/{id}/comments`
Add a comment to a task.

**Request:**
```json
{
  "content": "Great progress on this task!",
  "parentCommentId": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "comment-id",
    "content": "Great progress on this task!",
    "taskId": "task-id",
    "projectId": "project-id",
    "authorId": "user-id",
    "createdAt": "2024-01-01T00:00:00Z",
    "author": { "id": "...", "name": "...", "avatar": "..." }
  }
}
```

---

### Dashboard

#### **GET** `/api/dashboard`
Get user's personal dashboard with tasks and projects.

**Optional Query Parameters:**
- `projectId` (for project-specific dashboard)

**User Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "assignedTasks": [...],
    "projects": [...],
    "overdueTasks": [...],
    "recentActivity": [...],
    "totalProjects": 5,
    "totalAssignedTasks": 12,
    "completedTasks": 8
  }
}
```

**Project Dashboard Response:**
```json
{
  "success": true,
  "data": {
    "taskStats": [
      { "status": "TODO", "count": 5 },
      { "status": "IN_PROGRESS", "count": 3 },
      { "status": "DONE", "count": 10 }
    ],
    "recentTasks": [...],
    "overdueTasks": [...],
    "teamMembers": [...],
    "totalTasks": 18,
    "completedTasks": 10
  }
}
```

---

### Users

#### **GET** `/api/users/{id}`
Get user profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "...",
    "bio": "Full Stack Developer",
    "timezone": "UTC",
    "globalRole": "USER",
    "createdAt": "2024-01-01T00:00:00Z",
    "lastLoginAt": "2024-01-10T10:30:00Z"
  }
}
```

#### **PUT** `/api/users/{id}`
Update user profile (user can only update their own profile).

**Request:**
```json
{
  "name": "Updated Name",
  "avatar": "new-avatar-url",
  "bio": "Updated bio",
  "timezone": "EST"
}
```

---

## Authentication

All API endpoints except `/api/auth/signup` and `/api/auth/login` require authentication.

### Headers
```
Authorization: Bearer <jwt-token>
```

### JWT Payload
```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "role": "USER",
  "iat": 1704067200,
  "exp": 1704672000
}
```

---

## Role-Based Access Control

### Global Roles
- **SUPER_ADMIN**: System administrator with full access
- **ADMIN**: Can manage users and projects
- **USER**: Regular user

### Project Roles
- **OWNER**: Created the project, can delete it
- **ADMIN**: Can manage members and tasks
- **MEMBER**: Can create and manage tasks
- **VIEWER**: Read-only access

### Granular Permissions (per member)
- `canManageTasks`: Can create/edit/delete tasks
- `canManageMembers`: Can add/remove members
- `canDelete`: Can delete project

---

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED|FORBIDDEN|NOT_FOUND|BAD_REQUEST|VALIDATION_ERROR|INTERNAL_ERROR",
    "message": "Human-readable error message"
  }
}
```

---

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

### Project Validation
- Name: 2-100 characters
- Description: 0-500 characters

### Task Validation
- Title: 2-200 characters
- Description: 0-2000 characters
- Due date must be in the future

### Comment Validation
- Content: 1-2000 characters

---

## Sample Data

The database seed includes:
- 1 Admin user
- 2 Team members
- 2 Projects with various tasks
- Tags, comments, and notifications

**Test Credentials:**
```
Admin:
- Email: admin@example.com
- Password: Admin@123456

User 1:
- Email: john@example.com
- Password: Member@123456

User 2:
- Email: jane@example.com
- Password: Member@123456
```

Run `npm run db:seed` to populate the database.

---

## Features Implemented

✅ User authentication with JWT
✅ Role-based access control (Global + Project-level)
✅ Project management with team collaboration
✅ Task creation, assignment, and tracking
✅ Task status and priority management
✅ Subtasks and task dependencies
✅ Comments with nested replies
✅ File attachments
✅ Activity logging and audit trail
✅ Notifications system
✅ Dashboard with analytics
✅ Project invitations
✅ Pagination support
✅ Comprehensive error handling
✅ Data validation

---

## Security Considerations

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens with configurable expiry
- Role-based authorization on all endpoints
- Database cascade deletes for data integrity
- Input validation on all endpoints
- Protected routes require authentication

---

## Future Enhancements

- Email notifications
- Real-time updates with WebSockets
- File uploads to cloud storage (S3/Azure Blob)
- Advanced filtering and search
- Task templates and recurring tasks
- Time tracking and burndown charts
- Team reports and analytics
- Two-factor authentication (2FA)
- OAuth integration

---

## Development

### Database Management
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to MongoDB
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

### Building
```bash
npm run build
npm run start
```

---

## Support

For issues and questions, please create an issue in the repository.

---

## License

MIT License - feel free to use this project as a template for your own applications.
