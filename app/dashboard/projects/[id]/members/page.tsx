'use client'

import { useProjectMembers } from '@/app/hooks/useProjectMembers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Users } from 'lucide-react'
import { useParams } from 'next/navigation'

export default function ProjectMembersPage() {
    const { id } = useParams();
  const { data: membersData, isLoading, error } = useProjectMembers(id as string)

  const members = membersData?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-6 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 max-w-md">
          <p className="text-red-600 dark:text-red-400 text-center">Failed to load members.</p>
        </Card>
      </div>
    )
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
      case 'MEMBER':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      case 'VIEWER':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800'
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link href={`/dashboard/projects/${id}/members/add`}>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </Link>
        </div>

        {/* Members List */}
        {members.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">No members yet.</p>
            <Link href={`/dashboard/projects/${id}/members/add`}>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Member
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4">
            {members.map((member) => (
              <Card key={member.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {member.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {member.user.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getRoleColor(member.role)}>
                      {member.role}
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                {(member.canManageTasks || member.canManageMembers || member.canDelete) && (
                  <div className="mt-3 pt-3 border-t flex flex-wrap gap-2">
                    {member.canManageTasks && (
                      <Badge variant="outline">Manage Tasks</Badge>
                    )}
                    {member.canManageMembers && (
                      <Badge variant="outline">Manage Members</Badge>
                    )}
                    {member.canDelete && (
                      <Badge variant="outline">Can Delete</Badge>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
