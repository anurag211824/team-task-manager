'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAddMember } from '@/app/hooks/useProjectMembers'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { ProjectRole } from '@prisma/client'

export default function AddMemberPage() {
  const {id} = useParams()
  const router = useRouter()
  const { mutate: addMember, isPending, error } = useAddMember(id as string)

  const [formData, setFormData] = useState({
    userId: '',
    role: 'MEMBER' as ProjectRole,
    canManageTasks: false,
    canManageMembers: false,
    canDelete: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.userId.trim()) {
      return
    }

    addMember(
      {
        userId: formData.userId,
        role: formData.role as ProjectRole,
        canManageTasks: formData.canManageTasks,
        canManageMembers: formData.canManageMembers,
        canDelete: formData.canDelete,
      },
      {
        onSuccess: () => {
          router.push(`/dashboard/projects/${id}/members`)
        },
      }
    )
  }

  return (
    <div className="p-6">
      <Link href={`/dashboard/projects/${id}/members`} className="inline-flex">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </Button>
      </Link>

      <Card className="max-w-2xl">
        <div className="p-6 border-b">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Team Member</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Invite a user to your project
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="ml-2">{error instanceof Error ? error.message : 'Failed to add member'}</span>
            </Alert>
          )}

          <div>
            <Label htmlFor="userId" className="text-base font-semibold">
              User Email or ID *
            </Label>
            <Input
              id="userId"
              name="userId"
              placeholder="e.g., user@example.com or userId"
              value={formData.userId}
              onChange={handleChange}
              className="mt-2"
              disabled={isPending}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role" className="text-base font-semibold">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger className="mt-2" disabled={isPending}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Member</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="VIEWER">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Permissions</Label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  id="canManageTasks"
                  name="canManageTasks"
                  type="checkbox"
                  checked={formData.canManageTasks}
                  onChange={handleChange}
                  disabled={isPending}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="canManageTasks" className="ml-3 font-normal cursor-pointer">
                  Can manage tasks (create, edit, delete)
                </Label>
              </div>

              <div className="flex items-center">
                <input
                  id="canManageMembers"
                  name="canManageMembers"
                  type="checkbox"
                  checked={formData.canManageMembers}
                  onChange={handleChange}
                  disabled={isPending}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="canManageMembers" className="ml-3 font-normal cursor-pointer">
                  Can manage members (add, remove, edit)
                </Label>
              </div>

              <div className="flex items-center">
                <input
                  id="canDelete"
                  name="canDelete"
                  type="checkbox"
                  checked={formData.canDelete}
                  onChange={handleChange}
                  disabled={isPending}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="canDelete" className="ml-3 font-normal cursor-pointer">
                  Can delete project
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending || !formData.userId.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? 'Adding...' : 'Add Member'}
            </Button>
            <Link href={`/dashboard/projects/${id}/members`}>
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
