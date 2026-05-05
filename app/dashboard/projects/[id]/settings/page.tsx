'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useProject, useUpdateProject, useDeleteProject } from '@/app/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'

const PROJECT_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
]

export default function ProjectSettingsPage() {
  const {id} = useParams()
  const router = useRouter()
  const { data: project, isLoading } = useProject(id as string)
  const { mutate: updateProject, isPending: isUpdating, error: updateError } = useUpdateProject()
  const { mutate: deleteProject, isPending: isDeleting, error: deleteError } = useDeleteProject()

  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    color: project?.color || PROJECT_COLORS[0],
  })

  const [isDeleteConfirm, setIsDeleteConfirm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, color }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      return
    }

    updateProject(
      {
        id: id as string,
        data: {
          name: formData.name,
          description: formData.description || undefined,
          color: formData.color,
        },
      },
      {
        onSuccess: () => {
          router.push(`/dashboard/projects/${id}`)
        },
      }
    )
  }

  const handleDelete = () => {
    deleteProject(id as string, {
      onSuccess: () => {
        router.push('/dashboard/projects')
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 max-w-md">
          <p className="text-red-600 dark:text-red-400 text-center">Failed to load settings.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Link href={`/dashboard/projects/${id}`} className="inline-flex">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Project
        </Button>
      </Link>

      <div className="space-y-6">
        {/* Update Project Form */}
        <Card className="max-w-2xl">
          <div className="p-6 border-b">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your project information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {updateError && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="ml-2">{updateError instanceof Error ? updateError.message : 'Failed to update project'}</span>
              </Alert>
            )}

            <div>
              <Label htmlFor="name" className="text-base font-semibold">
                Project Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2"
                disabled={isUpdating}
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
                value={formData.description}
                onChange={handleChange}
                className="mt-2 resize-none"
                rows={4}
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">
                Project Color
              </Label>
              <div className="flex flex-wrap gap-3">
                {PROJECT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorChange(color)}
                    className={`w-12 h-12 rounded-lg transition-all border-2 ${
                      formData.color === color
                        ? 'border-gray-900 dark:border-white scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={isUpdating}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isUpdating || !formData.name.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href={`/dashboard/projects/${id}`}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        {/* Delete Project Section */}
        <Card className="max-w-2xl border-red-200 dark:border-red-900">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Danger Zone
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Deleting a project will permanently remove all tasks, members, and data associated with it.
            </p>

            {deleteError && (
              <Alert className="mt-4 border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="ml-2">{deleteError instanceof Error ? deleteError.message : 'Failed to delete project'}</span>
              </Alert>
            )}

            {isDeleteConfirm ? (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-semibold mb-4">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete Project'}
                  </Button>
                  <Button
                    onClick={() => setIsDeleteConfirm(false)}
                    variant="outline"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={() => setIsDeleteConfirm(true)}
                className="mt-4 bg-red-600 hover:bg-red-700 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Project
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
