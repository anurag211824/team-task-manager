'use client'

import { useProjects } from '@/app/hooks/useProjects'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FolderOpen, Users, CheckCircle2, Calendar } from 'lucide-react'

export default function ProjectsPage() {
  const { data, isLoading, hasNextPage, fetchNextPage } = useProjects()

  const projects = data?.pages?.flatMap((page) => page.data) || []

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your projects and collaborate with your team</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {projects.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No projects yet.</p>
          <Link href="/dashboard/projects/new">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Project
            </Button>
          </Link>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-l-4`}
                  style={{ borderLeftColor: project.color || '#3b82f6' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{project._count?.members || 0} members</span>
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {project.tasks?.length || 0} completed
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {project._count?.tasks || 0} tasks
                      </Badge>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-4 pt-4 border-t">
                    <p className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </p>
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
                Load More Projects
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
