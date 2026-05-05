'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCreateTask } from '@/app/hooks/useTasks'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { TaskPriority} from '@prisma/client'

export default function NewTaskPage() {
  const {id} =useParams()
  const router = useRouter()
  const { mutate: createTask, isPending, error } = useCreateTask()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as TaskPriority,
    dueDate: '',
    estimatedHours: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      return
    }

    createTask(
      {
        projectId: id as string,
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority as TaskPriority,
        dueDate: formData.dueDate || undefined,
        estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : undefined,
      },
      {
        onSuccess: () => {
          router.push(`/dashboard/projects/${id}/tasks`)
        },
      }
    )
  }

  return (
    <div className="p-6">
      <Link href={`/dashboard/projects/${id}/tasks`} className="inline-flex">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Tasks
        </Button>
      </Link>

      <Card className="max-w-2xl">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Task</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Add a new task to your project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="ml-2">{error instanceof Error ? error.message : 'Failed to create task'}</span>
            </Alert>
          )}

          <div>
            <Label htmlFor="title" className="text-base font-semibold">
              Task Title *
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Implement user authentication"
              value={formData.title}
              onChange={handleChange}
              className="mt-2"
              disabled={isPending}
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-semibold">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your task..."
              value={formData.description}
              onChange={handleChange}
              className="mt-2 resize-none"
              rows={4}
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="priority" className="text-base font-semibold">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate" className="text-base font-semibold">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className="mt-2"
                disabled={isPending}
              />
            </div>

            <div>
              <Label htmlFor="estimatedHours" className="text-base font-semibold">
                Estimated Hours
              </Label>
              <Input
                id="estimatedHours"
                name="estimatedHours"
                type="number"
                placeholder="e.g., 8"
                value={formData.estimatedHours}
                onChange={handleChange}
                className="mt-2"
                disabled={isPending}
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending || !formData.title.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? 'Creating...' : 'Create Task'}
            </Button>
            <Link href={`/dashboard/projects/${id}/tasks`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
