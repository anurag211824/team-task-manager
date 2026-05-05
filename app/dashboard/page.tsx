'use client'

import { useDashboard } from '@/app/hooks/useDashboard'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, CheckCircle2, AlertCircle, FolderOpen, ListTodo, TrendingUp, Clock } from 'lucide-react'

import { UserDashboardResponse } from "@/types"

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  // Type guard to narrow the union type
  const isUserDashboard = (d: unknown): d is UserDashboardResponse["data"] => {
    return !!(d && typeof d === 'object' && 'totalProjects' in d);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data || !isUserDashboard(data)) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 max-w-md">
          <p className="text-red-600 dark:text-red-400 text-center">Error loading dashboard. Please try again.</p>
        </Card>
      </div>
    )
  }

  const stats = {
    totalProjects: data.totalProjects,
    totalAssignedTasks: data.totalAssignedTasks,
    completedTasks: data.completedTasks,
    overdueTasks: data.overdueTasks?.length || 0,
  }

  const getCompletionRate = () => {
    if (stats.totalAssignedTasks === 0) return 0
    return Math.round((stats.completedTasks / stats.totalAssignedTasks) * 100)
  }

  const getStatusProgress = (status: string, manualProgress: number = 0) => {
    switch (status) {
      case 'DONE':
        return 100
      case 'IN_REVIEW':
        return 80
      case 'IN_PROGRESS':
        return manualProgress > 0 ? manualProgress : 40
      case 'TODO':
        return 10
      default:
        return 0
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here&apos;s your task overview.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6">
            <Plus className="h-5 w-5" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{stats.totalProjects}</p>
            </div>
            <div className="p-3 bg-blue-600 rounded-lg">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
            <Link href="/dashboard/projects" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
              View all →
            </Link>
          </div>
        </Card>

        {/* Total Tasks */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assigned Tasks</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{stats.totalAssignedTasks}</p>
            </div>
            <div className="p-3 bg-purple-600 rounded-lg">
              <ListTodo className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-purple-600 dark:text-purple-400">{getCompletionRate()}%</span> completion rate
            </p>
          </div>
        </Card>

        {/* Completed Tasks */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{stats.completedTasks}</p>
            </div>
            <div className="p-3 bg-green-600 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-800">
            <p className="text-xs text-gray-600 dark:text-gray-400">Great progress!</p>
          </div>
        </Card>

        {/* Overdue Tasks */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:shadow-lg transition-all">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-3">{stats.overdueTasks}</p>
            </div>
            <div className="p-3 bg-red-600 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-800">
            <p className="text-xs text-gray-600 dark:text-gray-400">Needs attention</p>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks - Large Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overdue Tasks */}
          {data.overdueTasks && data.overdueTasks.length > 0 && (
            <Card className="p-6 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Overdue Tasks</h2>
              </div>
              <div className="space-y-3">
                {data.overdueTasks.slice(0, 3).map(task => (
                  <Link
                    key={task.id}
                    href={`/dashboard/projects/${task.projectId}/tasks/${task.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 hover:shadow-md transition-all group"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white group-hover:text-red-600">{task.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Due: {new Date(task.dueDate!).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-red-200 text-red-700 dark:bg-red-900/40 dark:text-red-400 rounded">
                      {task.priority}
                    </span>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Tasks */}
          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
              </div>
              <Link href="/dashboard/projects" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View all
              </Link>
            </div>

            {data.assignedTasks && data.assignedTasks.length > 0 ? (
              <div className="space-y-3">
                {data.assignedTasks.slice(0, 5).map(task => (
                  <Link
                    key={task.id}
                    href={`/dashboard/projects/${task.projectId}/tasks/${task.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              task.status === 'DONE' ? 'bg-green-500' : 'bg-blue-600'
                            }`}
                            style={{ 
                              width: `${getStatusProgress(task.status, task.progress)}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 min-w-6.25">
                          {getStatusProgress(task.status, task.progress)}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        task.status === 'DONE'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : task.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ListTodo className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-gray-500 dark:text-gray-400">No tasks yet. Create one to get started!</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
            </div>
            {data.recentActivity && data.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {data.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {activity.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white leading-snug">
                        <span className="font-semibold">{activity.user?.name}</span>{' '}
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.createdAt).toLocaleDateString()} · {activity.project?.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <TrendingUp className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            )}
          </Card>

          {/* Projects */}
          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Projects</h2>
            {data.projects && data.projects.length > 0 ? (
              <div className="space-y-3">
                {data.projects.slice(0, 5).map(project => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="block"
                  >
                    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all cursor-pointer group">
                      <div className="flex items-start gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full mt-1 shrink-0"
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 text-sm">
                          {project.name}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project._count?.tasks || 0} tasks · {project._count?.members || 0} members
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FolderOpen className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">No projects yet</p>
              </div>
            )}
            <Link href="/dashboard/projects/new" className="mt-4 block w-full">
              <Button variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{getCompletionRate()}%</p>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-blue-600"
                    style={{ width: `${getCompletionRate()}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">On Track</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">{Math.max(0, stats.totalAssignedTasks - stats.overdueTasks)}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.totalAssignedTasks - stats.completedTasks}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

