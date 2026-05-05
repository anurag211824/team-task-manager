'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateProject } from '@/app/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const PROJECT_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
]

export default function NewProjectPage() {
  const router = useRouter()
  const { mutate: createProject, isPending, error } = useCreateProject()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: PROJECT_COLORS[0],
  })

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

    createProject(
      {
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color,
      },
      {
        onSuccess: () => {
          router.push('/dashboard/projects')
        },
      }
    )
  }

  return (
    <div className="p-6">
      <Link href="/dashboard/projects" className="inline-flex">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </Link>

      <Card className="max-w-2xl">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Project</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Start collaborating with your team by creating a new project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="ml-2">{error instanceof Error ? error.message : 'Failed to create project'}</span>
            </Alert>
          )}

          <div>
            <Label htmlFor="name" className="text-base font-semibold">
              Project Name *
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Website Redesign"
              value={formData.name}
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
              placeholder="Describe your project..."
              value={formData.description}
              onChange={handleChange}
              className="mt-2 resize-none"
              rows={4}
              disabled={isPending}
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
                  disabled={isPending}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending || !formData.name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? 'Creating...' : 'Create Project'}
            </Button>
            <Link href="/dashboard/projects">
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
