'use client'

import { useUser, useUpdateUser } from '@/app/hooks/useUser'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { useLayoutEffect, useEffect, useState } from 'react'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  // Simplified for now

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bio: '',
    timezone: 'UTC',
  })

  useLayoutEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
    }
  }, [])

  const { data: user, isLoading } = useUser(userId || '')
  const mutation = useUpdateUser()

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || '',
        bio: user.bio || '',
        timezone: user.timezone || 'UTC',
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    mutation.mutate({
      id: userId,
      data: formData,
    }, {
      onSuccess: () => {
        router.push('/dashboard/profile')
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-2xl ">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Update your personal information and preferences</p>
        </div>
      </div>

      <Card className="p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar URL</Label>
            <Input
              id="avatar"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Write a short bio about yourself"
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select 
              value={formData.timezone} 
              onValueChange={(value) => setFormData({ ...formData, timezone: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC (Universal Coordinated Time)</SelectItem>
                <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                <SelectItem value="IST">IST (India Standard Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Link href="/dashboard/profile" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
