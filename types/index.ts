import {
  GlobalRole,
  ProjectRole,
  TaskStatus,
  TaskPriority,
  NotificationType,
  ActivityAction,
  ActivityEntityType,
} from "@prisma/client";

// ============= AUTH TYPES =============
export interface JwtPayload {
  userId: string;
  email: string;
  role: GlobalRole;
  iat: number;
  exp: number;
}
export interface AuthRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends AuthRequest {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// ============= USER TYPES =============
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  bio?: string;
  timezone: string;
  globalRole: GlobalRole;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  avatar?: string;
  bio?: string;
  timezone?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

// ============= PROJECT TYPES =============
export interface CreateProjectRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  color?: string;
}

export interface ProjectResponse {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  ownerId: string;
  tasksCount: number;
  completedCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetailResponse extends ProjectResponse {
  owner: UserProfile;
  members: ProjectMemberResponse[];
  _count: {
    members: number;
    tasks: number;
  };
}

export interface ProjectListResponse {
  success: boolean;
  data: ProjectResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============= PROJECT MEMBER TYPES =============
export interface AddProjectMemberRequest {
  userId: string;
  role?: ProjectRole;
  canManageTasks?: boolean;
  canManageMembers?: boolean;
  canDelete?: boolean;
}

export interface UpdateProjectMemberRequest {
  role?: ProjectRole;
  canManageTasks?: boolean;
  canManageMembers?: boolean;
  canDelete?: boolean;
}

export interface ProjectMemberResponse {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectRole;
  canManageTasks: boolean;
  canManageMembers: boolean;
  canDelete: boolean;
  joinedAt: string;
  invitedBy?: string;
  user: UserProfile;
}

export interface ProjectMembersListResponse {
  success: boolean;
  data: ProjectMemberResponse[];
}

// ============= TAG TYPES =============
export interface TagResponse {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

// ============= TASK TYPES =============
export interface CreateTaskRequest {
  projectId: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  startDate?: string;
  assignedToId?: string;
  tagIds?: string[];
  estimatedHours?: number;
  parentTaskId?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  assignedToId?: string;
  tagIds?: string[];
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
}

export interface TaskResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  estimatedHours?: number;
  actualHours?: number;
  creatorId: string;
  assignedToId?: string;
  projectId: string;
  parentTaskId?: string;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDetailResponse extends TaskResponse {
  creator: UserProfile;
  assignedTo?: UserProfile;
  tags: TagResponse[];
  comments: TaskCommentResponse[];
  attachments: FileAttachmentResponse[];
  subtasks: TaskResponse[];
  _count: {
    comments: number;
    subtasks: number;
  };
}

export interface TaskListResponse {
  success: boolean;
  data: TaskResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskDetailApiResponse {
  success: boolean;
  data: TaskDetailResponse;
}

// ============= TASK COMMENT TYPES =============
export interface CreateCommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface TaskCommentResponse {
  id: string;
  content: string;
  taskId: string;
  projectId: string;
  authorId: string;
  parentCommentId?: string;
  createdAt: string;
  updatedAt: string;
  author: UserProfile;
  replies?: TaskCommentResponse[];
}

export interface CreateCommentResponse {
  success: boolean;
  data: TaskCommentResponse;
}

// ============= FILE ATTACHMENT TYPES =============
export interface FileAttachmentResponse {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  createdAt: string;
}

// ============= ACTIVITY TYPES =============
export interface ActivityResponse {
  id: string;
  projectId: string;
  userId: string;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityId: string;
  description: string;
  changes?: Record<string, unknown>;
  taskId?: string;
  createdAt: string;
  user: UserProfile;
}

// ============= NOTIFICATION TYPES =============
export interface NotificationResponse {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  projectId?: string;
  taskId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  expiresAt: string;
}

export interface NotificationsListResponse {
  success: boolean;
  data: NotificationResponse[];
  total: number;
  unreadCount: number;
}

// ============= DASHBOARD TYPES =============
export interface DashboardStats {
  totalProjects: number;
  totalAssignedTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface ProjectDashboardStats {
  taskStats: Array<{
    status: TaskStatus;
    count: number;
  }>;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
}

export interface UserDashboardResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
    assignedTasks: TaskResponse[];
    projects: ProjectResponse[];
    overdueTasks: TaskResponse[];
    recentActivity: ActivityResponse[];
  };
}

export interface ProjectDashboardResponse {
  success: boolean;
  data: {
    stats: ProjectDashboardStats;
    recentTasks: TaskResponse[];
    overdueTasks: TaskResponse[];
    teamMembers: ProjectMemberResponse[];
  };
}

// ============= API RESPONSE TYPES =============
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T = unknown> extends ApiResponse<PaginatedResponse<T>> {}

// ============= QUERY TYPES FOR TANSTACK =============
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface TaskQueryParams extends QueryParams {
  projectId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToId?: string;
}

export interface ProjectQueryParams extends QueryParams {}

export interface MemberQueryParams extends QueryParams {
  projectId: string;
}

// ============= ERROR TYPES =============
export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  BAD_REQUEST = "BAD_REQUEST",
  CONFLICT = "CONFLICT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: unknown;
}
