# 📁 Project Folder Structure & API Integration Guide

## Directory Organization

```
team-task-manager/
├── app/
│   ├── (auth)/                          # Auth routes group
│   │   ├── signup/
│   │   │   └── page.tsx                # Signup page - uses useAuth().signup
│   │   ├── login/
│   │   │   └── page.tsx                # Login page - uses useAuth().login
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/                    # Main app routes (protected)
│   │   ├── page.tsx                    # Home/Dashboard - uses useDashboard()
│   │   ├── layout.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── page.tsx                # Projects list - uses useProjects()
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx            # Project detail - uses useProject()
│   │   │   │   ├── layout.tsx
│   │   │   │   │
│   │   │   │   ├── tasks/
│   │   │   │   │   ├── page.tsx        # Project tasks list - uses useTasks()
│   │   │   │   │   ├── [taskId]/
│   │   │   │   │   │   ├── page.tsx    # Task detail - uses useTask()
│   │   │   │   │   │   └── layout.tsx
│   │   │   │   │   └── new/
│   │   │   │   │       └── page.tsx    # Create task - uses useCreateTask()
│   │   │   │   │
│   │   │   │   ├── members/
│   │   │   │   │   ├── page.tsx        # Members list - uses useProjectMembers()
│   │   │   │   │   └── add/
│   │   │   │   │       └── page.tsx    # Add member - uses useAddMember()
│   │   │   │   │
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx        # Project settings - uses useUpdateProject()
│   │   │   │
│   │   │   └── new/
│   │   │       └── page.tsx            # Create project - uses useCreateProject()
│   │   │
│   │   ├── profile/
│   │   │   ├── page.tsx                # User profile - uses useUser()
│   │   │   └── edit/
│   │   │       └── page.tsx            # Edit profile - uses useUpdateUser()
│   │   │
│   │   └── notifications/
│   │       └── page.tsx                # Notifications - uses useNotifications()
│   │
│   ├── api/                            # API routes (backend)
│   │   ├── auth/
│   │   │   ├── signup/route.ts
│   │   │   └── login/route.ts
│   │   ├── projects/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── members/
│   │   │           ├── route.ts
│   │   │           └── [memberId]/route.ts
│   │   ├── tasks/
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── route.ts
│   │   │       └── comments/route.ts
│   │   ├── users/
│   │   │   └── [id]/route.ts
│   │   ├── dashboard/
│   │   │   └── route.ts
│   │   └── notifications/
│   │       └── route.ts
│   │
│   ├── hooks/                          # Custom TanStack Query hooks
│   │   ├── useAuth.ts                  # Auth mutations
│   │   ├── useProjects.ts              # Project queries & mutations
│   │   ├── useTasks.ts                 # Task queries & mutations
│   │   ├── useProjectMembers.ts        # Member queries & mutations
│   │   ├── useDashboard.ts             # Dashboard queries
│   │   ├── useUser.ts                  # User queries & mutations
│   │   ├── useComments.ts              # Comment mutations
│   │   └── useNotifications.ts         # Notification queries
│   │
│   ├── components/                     # Reusable React components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── LoginForm.tsx           # Uses useAuth().login
│   │   │   ├── SignupForm.tsx          # Uses useAuth().signup
│   │   │   ├── ProjectForm.tsx         # Uses useCreateProject() or useUpdateProject()
│   │   │   ├── TaskForm.tsx            # Uses useCreateTask() or useUpdateTask()
│   │   │   ├── CommentForm.tsx         # Uses useAddComment()
│   │   │   ├── MemberForm.tsx          # Uses useAddMember() or useUpdateMember()
│   │   │   └── ProfileForm.tsx         # Uses useUpdateUser()
│   │   │
│   │   ├── cards/
│   │   │   ├── ProjectCard.tsx         # Display project info
│   │   │   ├── TaskCard.tsx            # Display task info
│   │   │   ├── MemberCard.tsx          # Display member info
│   │   │   └── NotificationCard.tsx    # Display notification
│   │   │
│   │   ├── lists/
│   │   │   ├── ProjectsList.tsx        # Uses useProjects()
│   │   │   ├── TasksList.tsx           # Uses useTasks()
│   │   │   ├── MembersList.tsx         # Uses useProjectMembers()
│   │   │   └── NotificationsList.tsx   # Uses useNotifications()
│   │   │
│   │   ├── dialogs/
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── MemberDialog.tsx        # Uses useAddMember(), useUpdateMember()
│   │   │   ├── TaskDialog.tsx          # Uses useCreateTask(), useUpdateTask()
│   │   │   └── ProjectDialog.tsx       # Uses useCreateProject()
│   │   │
│   │   └── common/
│   │       ├── Loading.tsx
│   │       ├── Error.tsx
│   │       ├── Empty.tsx
│   │       └── Pagination.tsx
│   │
│   ├── globals.css
│   ├── layout.tsx                      # Root layout with QueryProvider
│   └── page.tsx                        # Root redirect to dashboard
│
├── lib/
│   ├── api-client.ts                   # Axios instance with auth header
│   ├── auth-middleware.ts
│   ├── auth/
│   │   ├── jwt.ts
│   │   └── password.ts
│   ├── permissions.ts
│   ├── db.ts
│   ├── validations.ts
│   └── query-provider.tsx              # TanStack Query provider
│
├── types/
│   └── index.ts                        # All TypeScript interfaces
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── public/
│   ├── images/
│   └── icons/
│
├── .env.local                          # Environment variables
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🔗 API Integration by Page

### **Authentication Pages**

#### **Signup Page** (`app/(auth)/signup/page.tsx`)
```typescript
import { SignupForm } from "@/components/forms/SignupForm";

export default function SignupPage() {
  return (
    <div className="auth-container">
      <SignupForm />
    </div>
  );
}
```

**Component:** `components/forms/SignupForm.tsx`
```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";
import { SignupRequest } from "@/types";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  
  const handleSubmit = async (data: SignupRequest) => {
    signup.mutate(data, {
      onSuccess: () => router.push("/dashboard")
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
        name: e.currentTarget.name.value,
      });
    }}>
      <input name="name" placeholder="Full Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button disabled={signup.isPending}>
        {signup.isPending ? "Creating..." : "Sign Up"}
      </button>
    </form>
  );
}
```

**API Used:** `POST /api/auth/signup`  
**Hook:** `useAuth().signup`  
**Flow:** Form → Hook mutation → API → Token stored in localStorage → Redirect to dashboard

---

#### **Login Page** (`app/(auth)/login/page.tsx`)
```typescript
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="auth-container">
      <LoginForm />
    </div>
  );
}
```

**Component:** `components/forms/LoginForm.tsx`
```typescript
"use client";

import { useAuth } from "@/hooks/useAuth";
import { AuthRequest } from "@/types";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  
  const handleSubmit = async (data: AuthRequest) => {
    login.mutate(data, {
      onSuccess: () => router.push("/dashboard")
    });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
      });
    }}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button disabled={login.isPending}>
        {login.isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

**API Used:** `POST /api/auth/login`  
**Hook:** `useAuth().login`  
**Flow:** Form → Hook mutation → API → Token stored → Navigate to dashboard

---

### **Dashboard Pages**

#### **Dashboard Home** (`app/(dashboard)/page.tsx`)
```typescript
"use client";

import { useDashboard } from "@/hooks/useDashboard";
import { Loading, Error } from "@/components/common";
import { TasksList } from "@/components/lists/TasksList";
import { ProjectsList } from "@/components/lists/ProjectsList";

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <Loading />;
  if (error) return <Error message={error.message} />;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard title="Total Projects" value={data?.totalProjects} />
        <StatCard title="Assigned Tasks" value={data?.totalAssignedTasks} />
        <StatCard title="Completed" value={data?.completedTasks} />
        <StatCard title="Overdue" value={data?.overdueTasks} />
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2>My Tasks</h2>
          <TasksList tasks={data?.assignedTasks} />
        </section>
        
        <section>
          <h2>My Projects</h2>
          <ProjectsList projects={data?.projects} />
        </section>
      </div>

      <section className="mt-6">
        <h2>Recent Activity</h2>
        {data?.recentActivity.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </section>
    </div>
  );
}
```

**API Used:** `GET /api/dashboard`  
**Hook:** `useDashboard()`  
**Data:** Stats, assigned tasks, projects, overdue tasks, recent activity

---

### **Projects Pages**

#### **Projects List** (`app/(dashboard)/projects/page.tsx`)
```typescript
"use client";

import { useProjects } from "@/hooks/useProjects";
import { ProjectsList } from "@/components/lists/ProjectsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectsPage() {
  const { 
    data, 
    isLoading, 
    error, 
    hasNextPage, 
    fetchNextPage 
  } = useProjects({ limit: 10 });

  const allProjects = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div className="projects-container">
      <div className="header flex justify-between items-center">
        <h1>Projects</h1>
        <Link href="/projects/new">
          <Button>New Project</Button>
        </Link>
      </div>
      
      <ProjectsList projects={allProjects} isLoading={isLoading} />
      
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} className="w-full mt-4">
          Load More
        </Button>
      )}
    </div>
  );
}
```

**API Used:** `GET /api/projects` (paginated, infinite scroll)  
**Hook:** `useProjects(params)`  
**Features:** Pagination, filtering, sorting

---

#### **Create Project** (`app/(dashboard)/projects/new/page.tsx`)
```typescript
"use client";

import { ProjectForm } from "@/components/forms/ProjectForm";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/projects");
  };

  return (
    <div className="container">
      <h1>Create New Project</h1>
      <ProjectForm onSuccess={handleSuccess} />
    </div>
  );
}
```

**Component:** `components/forms/ProjectForm.tsx`
```typescript
"use client";

import { useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { CreateProjectRequest, UpdateProjectRequest } from "@/types";

export function ProjectForm({ 
  projectId, 
  onSuccess 
}: { 
  projectId?: string;
  onSuccess: () => void;
}) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const handleSubmit = (data: CreateProjectRequest | UpdateProjectRequest) => {
    if (projectId) {
      updateProject.mutate({ id: projectId, data }, { onSuccess });
    } else {
      createProject.mutate(data as CreateProjectRequest, { onSuccess });
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        name: e.currentTarget.name.value,
        description: e.currentTarget.description.value,
        color: e.currentTarget.color.value,
      });
    }}>
      <input name="name" placeholder="Project Name" required />
      <textarea name="description" placeholder="Description" />
      <input name="color" type="color" defaultValue="#3b82f6" />
      <button disabled={createProject.isPending || updateProject.isPending}>
        {projectId ? "Update" : "Create"}
      </button>
    </form>
  );
}
```

**API Used:** `POST /api/projects`  
**Hook:** `useCreateProject()`  
**Flow:** Form → Hook mutation → API → Cache invalidated → Redirect to list

---

#### **Project Detail** (`app/(dashboard)/projects/[id]/page.tsx`)
```typescript
"use client";

import { useProject } from "@/hooks/useProjects";
import { Link } from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { data: project, isLoading, error } = useProject(params.id);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="project-detail">
      <div className="header">
        <h1>{project?.name}</h1>
        <p>{project?.description}</p>
      </div>

      <div className="info-grid">
        <div>Owner: {project?.owner?.name}</div>
        <div>Members: {project?._count?.members}</div>
        <div>Tasks: {project?._count?.tasks}</div>
        <div style={{ backgroundColor: project?.color }} className="w-10 h-10 rounded" />
      </div>

      <div className="tabs space-y-4">
        <Link href={`/projects/${params.id}/tasks`}>
          <Button>Tasks ({project?._count?.tasks})</Button>
        </Link>
        <Link href={`/projects/${params.id}/members`}>
          <Button>Members ({project?._count?.members})</Button>
        </Link>
        <Link href={`/projects/${params.id}/settings`}>
          <Button>Settings</Button>
        </Link>
      </div>
    </div>
  );
}
```

**API Used:** `GET /api/projects/{id}`  
**Hook:** `useProject(id)`  
**Data:** Project details, owner, members count, tasks count

---

### **Task Pages**

#### **Project Tasks List** (`app/(dashboard)/projects/[id]/tasks/page.tsx`)
```typescript
"use client";

import { useTasks } from "@/hooks/useTasks";
import { TasksList } from "@/components/lists/TasksList";
import { TaskStatus, TaskPriority } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectTasksPage({ 
  params,
  searchParams
}: { 
  params: { id: string };
  searchParams: { status?: string; priority?: string };
}) {
  const { data, isLoading, hasNextPage, fetchNextPage } = useTasks({
    projectId: params.id,
    status: searchParams.status as TaskStatus,
    priority: searchParams.priority as TaskPriority,
  });

  const allTasks = data?.pages.flatMap(page => page.data) ?? [];

  return (
    <div>
      <div className="header flex justify-between items-center">
        <h1>Tasks</h1>
        <Link href={`/projects/${params.id}/tasks/new`}>
          <Button>New Task</Button>
        </Link>
      </div>

      <div className="filters space-x-2">
        {/* Status and priority filter buttons */}
      </div>

      <TasksList tasks={allTasks} isLoading={isLoading} />
      
      {hasNextPage && (
        <Button onClick={() => fetchNextPage()} className="w-full mt-4">
          Load More
        </Button>
      )}
    </div>
  );
}
```

**API Used:** `GET /api/tasks?projectId={id}&status={status}&priority={priority}`  
**Hook:** `useTasks(params)`  
**Features:** Filtering by status, priority, assignee; pagination

---

#### **Create Task** (`app/(dashboard)/projects/[id]/tasks/new/page.tsx`)
```typescript
"use client";

import { TaskForm } from "@/components/forms/TaskForm";
import { useRouter } from "next/navigation";

export default function NewTaskPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter();

  return (
    <div>
      <h1>Create New Task</h1>
      <TaskForm 
        projectId={params.id}
        onSuccess={() => router.push(`/projects/${params.id}/tasks`)}
      />
    </div>
  );
}
```

**Component:** `components/forms/TaskForm.tsx`
```typescript
"use client";

import { useCreateTask, useUpdateTask } from "@/hooks/useTasks";
import { CreateTaskRequest, UpdateTaskRequest } from "@/types";

export function TaskForm({ 
  projectId, 
  taskId,
  onSuccess 
}: { 
  projectId: string;
  taskId?: string;
  onSuccess: () => void;
}) {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const handleSubmit = (data: any) => {
    if (taskId) {
      updateTask.mutate({ id: taskId, data }, { onSuccess });
    } else {
      createTask.mutate({ ...data, projectId }, { onSuccess });
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        title: e.currentTarget.title.value,
        description: e.currentTarget.description.value,
        status: e.currentTarget.status.value,
        priority: e.currentTarget.priority.value,
        dueDate: e.currentTarget.dueDate.value,
        assignedToId: e.currentTarget.assignedToId.value,
      });
    }}>
      <input name="title" placeholder="Task Title" required />
      <textarea name="description" placeholder="Description" />
      <select name="status" defaultValue="TODO">
        <option value="TODO">To Do</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="IN_REVIEW">In Review</option>
        <option value="DONE">Done</option>
      </select>
      <select name="priority" defaultValue="MEDIUM">
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>
      <input name="dueDate" type="date" />
      <select name="assignedToId">
        <option value="">Unassigned</option>
        {/* Member options */}
      </select>
      <button disabled={createTask.isPending || updateTask.isPending}>
        {taskId ? "Update" : "Create"}
      </button>
    </form>
  );
}
```

**API Used:** `POST /api/tasks` or `PUT /api/tasks/{id}`  
**Hooks:** `useCreateTask()` or `useUpdateTask()`

---

#### **Task Detail** (`app/(dashboard)/projects/[id]/tasks/[taskId]/page.tsx`)
```typescript
"use client";

import { useTask } from "@/hooks/useTasks";
import { TaskComments } from "@/components/TaskComments";
import { TaskAttachments } from "@/components/TaskAttachments";
import { Subtasks } from "@/components/Subtasks";

export default function TaskDetailPage({ 
  params 
}: { 
  params: { id: string; taskId: string } 
}) {
  const { data: task, isLoading, error } = useTask(params.taskId);

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="task-detail">
      <h1>{task?.title}</h1>
      <p>{task?.description}</p>
      
      <div className="task-meta grid grid-cols-4 gap-4">
        <div>Status: <span className="badge">{task?.status}</span></div>
        <div>Priority: <span className="badge">{task?.priority}</span></div>
        <div>Assigned to: {task?.assignedTo?.name}</div>
        <div>Progress: <ProgressBar value={task?.progress || 0} /></div>
      </div>

      <div className="task-sections space-y-6">
        <TaskComments taskId={params.taskId} comments={task?.comments} />
        <TaskAttachments attachments={task?.attachments} />
        {task?.subtasks?.length > 0 && (
          <Subtasks subtasks={task.subtasks} />
        )}
      </div>
    </div>
  );
}
```

**API Used:** `GET /api/tasks/{id}`  
**Hook:** `useTask(id)`  
**Data:** Full task details, comments, attachments, subtasks

---

### **Team Management Pages**

#### **Project Members** (`app/(dashboard)/projects/[id]/members/page.tsx`)
```typescript
"use client";

import { useProjectMembers } from "@/hooks/useProjectMembers";
import { MembersList } from "@/components/lists/MembersList";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectMembersPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { data: members, isLoading, error } = useProjectMembers(params.id);

  return (
    <div>
      <div className="header flex justify-between items-center">
        <h1>Team Members</h1>
        <Link href={`/projects/${params.id}/members/add`}>
          <Button>Add Member</Button>
        </Link>
      </div>

      <MembersList members={members} projectId={params.id} isLoading={isLoading} />
    </div>
  );
}
```

**Component:** `components/lists/MembersList.tsx`
```typescript
"use client";

import { ProjectMemberResponse } from "@/types";
import { useDeleteMember, useUpdateMember } from "@/hooks/useProjectMembers";
import { MemberCard } from "../cards/MemberCard";

export function MembersList({ 
  members, 
  projectId 
}: { 
  members: ProjectMemberResponse[];
  projectId: string;
}) {
  const deleteMember = useDeleteMember(projectId);
  const updateMember = useUpdateMember(projectId);

  return (
    <div className="members-grid grid grid-cols-3 gap-4">
      {members?.map(member => (
        <MemberCard 
          key={member.id} 
          member={member}
          onDelete={() => deleteMember.mutate(member.id)}
          onUpdateRole={(role) => updateMember.mutate({ 
            memberId: member.id, 
            data: { role } 
          })}
        />
      ))}
    </div>
  );
}
```

**API Used:** `GET /api/projects/{id}/members`  
**Hook:** `useProjectMembers(projectId)`

---

#### **Add Member** (`app/(dashboard)/projects/[id]/members/add/page.tsx`)
```typescript
"use client";

import { MemberForm } from "@/components/forms/MemberForm";
import { useRouter } from "next/navigation";

export default function AddMemberPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter();

  return (
    <div>
      <h1>Add Team Member</h1>
      <MemberForm 
        projectId={params.id}
        onSuccess={() => router.push(`/projects/${params.id}/members`)}
      />
    </div>
  );
}
```

**Component:** `components/forms/MemberForm.tsx`
```typescript
"use client";

import { useAddMember, useUpdateMember } from "@/hooks/useProjectMembers";
import { AddProjectMemberRequest } from "@/types";

export function MemberForm({ 
  projectId, 
  memberId,
  onSuccess 
}: { 
  projectId: string;
  memberId?: string;
  onSuccess: () => void;
}) {
  const addMember = useAddMember(projectId);
  const updateMember = useUpdateMember(projectId);

  const handleSubmit = (data: AddProjectMemberRequest) => {
    if (memberId) {
      updateMember.mutate({ memberId, data }, { onSuccess });
    } else {
      addMember.mutate(data, { onSuccess });
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        userId: e.currentTarget.userId.value,
        role: e.currentTarget.role.value as any,
        canManageTasks: e.currentTarget.canManageTasks.checked,
        canManageMembers: e.currentTarget.canManageMembers.checked,
        canDelete: e.currentTarget.canDelete.checked,
      });
    }}>
      <select name="userId" required>
        <option value="">Select User</option>
        {/* User options */}
      </select>
      <select name="role" defaultValue="MEMBER">
        <option value="OWNER">Owner</option>
        <option value="ADMIN">Admin</option>
        <option value="MEMBER">Member</option>
        <option value="VIEWER">Viewer</option>
      </select>
      <label>
        <input name="canManageTasks" type="checkbox" defaultChecked />
        Can Manage Tasks
      </label>
      <label>
        <input name="canManageMembers" type="checkbox" />
        Can Manage Members
      </label>
      <label>
        <input name="canDelete" type="checkbox" />
        Can Delete Project
      </label>
      <button disabled={addMember.isPending || updateMember.isPending}>
        {memberId ? "Update" : "Add"}
      </button>
    </form>
  );
}
```

**API Used:** `POST /api/projects/{id}/members`  
**Hook:** `useAddMember(projectId)`

---

### **User Pages**

#### **User Profile** (`app/(dashboard)/profile/page.tsx`)
```typescript
"use client";

import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { ProfileCard } from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
  const { data: user, isLoading } = useUser(userId);

  if (isLoading) return <Loading />;

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <ProfileCard user={user} />
      
      <div className="actions space-x-4">
        <Link href="/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
        <Button 
          onClick={() => {
            logout();
            router.push("/login");
          }} 
          variant="destructive"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
```

**API Used:** `GET /api/users/{id}`  
**Hook:** `useUser(id)`

---

#### **Edit Profile** (`app/(dashboard)/profile/edit/page.tsx`)
```typescript
"use client";

import { ProfileForm } from "@/components/forms/ProfileForm";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  return (
    <div>
      <h1>Edit Profile</h1>
      <ProfileForm 
        onSuccess={() => router.push("/profile")}
      />
    </div>
  );
}
```

**Component:** `components/forms/ProfileForm.tsx`
```typescript
"use client";

import { useUpdateUser, useUser } from "@/hooks/useUser";
import { UpdateUserProfileRequest } from "@/types";

export function ProfileForm({ onSuccess }: { onSuccess: () => void }) {
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
  const { data: user } = useUser(userId);
  const updateUser = useUpdateUser();

  const handleSubmit = (data: UpdateUserProfileRequest) => {
    updateUser.mutate({ id: userId, data }, { onSuccess });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({
        name: e.currentTarget.name.value,
        avatar: e.currentTarget.avatar.value,
        bio: e.currentTarget.bio.value,
        timezone: e.currentTarget.timezone.value,
      });
    }}>
      <input name="name" defaultValue={user?.name} required />
      <input name="avatar" type="url" placeholder="Avatar URL" defaultValue={user?.avatar} />
      <textarea name="bio" placeholder="Bio" defaultValue={user?.bio} />
      <select name="timezone" defaultValue={user?.timezone}>
        <option value="UTC">UTC</option>
        <option value="EST">EST</option>
        <option value="CST">CST</option>
        <option value="PST">PST</option>
      </select>
      <button disabled={updateUser.isPending}>
        {updateUser.isPending ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
```

**API Used:** `PUT /api/users/{id}`  
**Hook:** `useUpdateUser()`

---

### **Notifications Page**

#### **Notifications** (`app/(dashboard)/notifications/page.tsx`)
```typescript
"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { NotificationsList } from "@/components/lists/NotificationsList";

export default function NotificationsPage() {
  const { data, isLoading } = useNotifications();

  return (
    <div>
      <h1>Notifications</h1>
      <NotificationsList 
        notifications={data?.data} 
        unreadCount={data?.unreadCount}
        isLoading={isLoading}
      />
    </div>
  );
}
```

**API Used:** `GET /api/notifications`  
**Hook:** `useNotifications()`

---

## 📊 Component Hierarchy

```
Root Layout
└── QueryProvider (lib/query-provider.tsx)
    └── RootLayout (app/layout.tsx)
        ├── Header Component
        │   ├── Logo
        │   ├── User menu (useUser)
        │   └── Notification badge (useNotifications)
        ├── Sidebar Component
        │   ├── Projects list (useProjects)
        │   └── Navigation links
        └── Main Content Area
            ├── (auth) Group
            │   ├── /login
            │   └── /signup
            └── (dashboard) Group
                ├── / (Dashboard - useDashboard)
                ├── /projects (useProjects)
                │   ├── /[id] (useProject)
                │   │   ├── /tasks (useTasks)
                │   │   │   ├── /[taskId] (useTask + useAddComment)
                │   │   │   └── /new (useCreateTask)
                │   │   ├── /members (useProjectMembers)
                │   │   │   ├── /add (useAddMember)
                │   │   │   └── /[memberId] (useUpdateMember)
                │   │   └── /settings (useUpdateProject)
                │   └── /new (useCreateProject)
                ├── /profile (useUser)
                │   └── /edit (useUpdateUser)
                └── /notifications (useNotifications)
```

---

## 🔄 Data Flow Examples

### Complete Task Lifecycle

```
1. USER VIEWS DASHBOARD
   useDashboard() → GET /api/dashboard
   ↓ displays assigned tasks & projects

2. USER OPENS PROJECT TASKS
   useTasks({ projectId }) → GET /api/tasks?projectId={id}
   ↓ displays task list with filters

3. USER CREATES NEW TASK
   useCreateTask() → POST /api/tasks
   ↓ form submission → hook mutation → API call
   ↓ cache invalidated → task list refreshes
   ↓ redirect to task detail

4. USER VIEWS TASK DETAIL
   useTask(id) → GET /api/tasks/{id}
   ↓ displays full task with comments & attachments

5. USER ADDS COMMENT
   useAddComment(taskId) → POST /api/tasks/{id}/comments
   ↓ comment added → cache invalidated
   ↓ comment list refreshes

6. USER UPDATES TASK STATUS
   useUpdateTask() → PUT /api/tasks/{id}
   ↓ status updated → cache invalidated
   ↓ task detail refreshes → dashboard stats update
```

---

## ✅ Integration Checklist

- [ ] Create auth folder structure with pages
- [ ] Create dashboard folder structure with pages
- [ ] Build reusable form components
- [ ] Build list components for projects, tasks, members
- [ ] Build card components for displaying items
- [ ] Implement common components (Loading, Error, Empty, Pagination)
- [ ] Set up QueryProvider in root layout
- [ ] Test API integration with hooks
- [ ] Implement loading & error states
- [ ] Add form validation
- [ ] Implement cache invalidation strategies
- [ ] Add optimistic updates where needed
- [ ] Test infinite query pagination
- [ ] Add offline support (optional)

---

**Status:** 🚀 Ready to start building pages!
