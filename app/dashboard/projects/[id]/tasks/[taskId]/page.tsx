'use client'

import { useTask, useUpdateTask } from '@/app/hooks/useTasks'
import { useProjectMembers } from '@/app/hooks/useProjectMembers'
import { useAddComment } from '@/app/hooks/useComments'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft, Calendar, User, MessageSquare, Clock } from 'lucide-react'
import { useState } from 'react'
import { TaskStatus, TaskPriority } from '@prisma/client'
import { ProjectMemberResponse } from '@/types'
import { useParams } from 'next/navigation'

export default function TaskDetailPage() {
  const { id: projectId, taskId } = useParams()
  const { data: task, isLoading: isTaskLoading, error: taskError } = useTask(taskId as string)
  const { data: membersResponse, isLoading: isMembersLoading } = useProjectMembers(projectId as string)
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask()
  const { mutate: addComment, isPending: isAddingComment } = useAddComment(taskId as string)

  const members = Array.isArray(membersResponse) ? membersResponse : (Array.isArray(membersResponse?.data) ? membersResponse.data : []);

  const [commentText, setCommentText] = useState('')

  const isLoading = isTaskLoading || isMembersLoading

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (taskError || !task) {
    return (
      <div className="flex items-center justify-center h-full min-h-100">
        <Card className="p-6 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 max-w-md">
          <p className="text-red-600 dark:text-red-400 text-center">Failed to load task.</p>
        </Card>
      </div>
    )
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask({
      id: taskId as string,
      data: { status: newStatus },
    })
  }

  const handlePriorityChange = (newPriority: TaskPriority) => {
    updateTask({
      id: taskId as string,
      data: { priority: newPriority },
    })
  }

  const handleAssigneeChange = (userId: string) => {
    updateTask({
      id: taskId as string,
      data: { assignedToId: userId === 'unassigned' ? undefined : userId },
    })
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return

    addComment(
      {
        content: commentText,
      },
      {
        onSuccess: () => {
          setCommentText('')
        },
      }
    )
  }

  return (
    <div className="p-6">
      <Link href={`/dashboard/projects/${projectId}/tasks`} className="inline-flex">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Header */}
          <Card className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {task.title}
            </h1>
            {task.description && (
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {task.description}
              </p>
            )}
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments ({task.comments?.length || 0})
            </h2>

            {/* Add Comment */}
            <div className="mb-6 space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="resize-none"
                rows={3}
                disabled={isAddingComment}
              />
              <Button
                onClick={handleAddComment}
                disabled={isAddingComment || !commentText.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAddingComment ? 'Adding...' : 'Add Comment'}
              </Button>
            </div>

            {/* Comments List */}
            {task.comments && task.comments.length > 0 ? (
              <ScrollArea className="space-y-4">
                {task.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg mb-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {comment.author.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Status
            </h3>
            <Select value={task.status} onValueChange={(value) => handleStatusChange(value as TaskStatus)}>
              <SelectTrigger disabled={isUpdating}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="IN_REVIEW">In Review</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Priority */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Priority
            </h3>
            <Select value={task.priority} onValueChange={(value) => handlePriorityChange(value as TaskPriority)}>
              <SelectTrigger disabled={isUpdating}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </Card>

          {/* Assigned To */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Assigned To
            </h3>
            <div className="space-y-4">
              <Select 
                value={task.assignedToId || 'unassigned'} 
                onValueChange={handleAssigneeChange}
              >
                <SelectTrigger disabled={isUpdating} className="w-full">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members?.map((member: ProjectMemberResponse) => (
                    <SelectItem key={member.user.id} value={member.user.id}>
                      {member.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {task.assignedTo && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
                    {task.assignedTo.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.assignedTo.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {task.assignedTo.email}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Due Date */}
          {task.dueDate && (
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Due Date
              </h3>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </Card>
          )}

          {/* Creator Info */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Created By
            </h3>
            <p className="font-semibold text-gray-900 dark:text-white">
              {task.creator.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
