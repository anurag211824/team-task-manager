'use client'

import { useTasks } from '@/app/hooks/useTasks'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, ArrowLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import { useState } from 'react'
import { TaskStatus, TaskPriority } from '@prisma/client'
import { useParams } from 'next/navigation'

export default function ProjectTasksPage({
}) {
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [priority, setPriority] = useState<TaskPriority | ''>('')
  const { id } = useParams()
  const { data, isLoading, hasNextPage, fetchNextPage } = useTasks({
    projectId: id as string,
    status: status || undefined,
    priority: priority || undefined,
  })

  const tasks = data?.pages?.flatMap((page) => page.data) || []

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'DONE':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6">
      <Link href={`/dashboard/projects/${id}`} className="inline-flex">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </Button>
      </Link>

      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Tasks</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href={`/dashboard/projects/${id}/tasks/new`}>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus | "")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODO">To Do</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority | "")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No tasks found.</p>
            <Link href={`/dashboard/projects/${id}/tasks/new`}>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Task
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/dashboard/projects/${id}/tasks/${task.id}`}
                >
                  <Card className="p-4 cursor-pointer hover:shadow-md transition-all">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getStatusIcon(task.status)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge variant="outline">{task.status}</Badge>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={() => fetchNextPage()}
                  variant="outline"
                  className="gap-2"
                >
                  Load More Tasks
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
