'use client'

import { useUser } from '@/app/hooks/useUser'
import { useAuth } from '@/app/hooks/useAuth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Edit, LogOut, Mail, Globe, Calendar, User as UserIcon, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (storedUserId) {
      setUserId(storedUserId)
    }
  }, [])

  const { data: user, isLoading, error } = useUser(userId || '')

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <Card className="p-6 border-red-200 bg-red-50 text-red-600">
          Error loading profile. Please try logging in again.
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage your personal information</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/profile/edit">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </Link>
          <Button variant="outline" onClick={handleLogout} className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Avatar and Summary */}
        <Card className="p-6 border border-gray-200 dark:border-gray-800 flex flex-col items-center text-center h-fit">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
          <p className="text-blue-600 dark:text-blue-400 font-medium mt-1 uppercase text-xs tracking-wider">{user.globalRole}</p>
          
          <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{user.timezone}</span>
            </div>
          </div>
        </Card>

        {/* Right Column - Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-blue-600" />
              About Me
            </h3>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bio</label>
                <p className="text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                  {user.bio || "No bio information provided. Tell your team about yourself!"}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Joined
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1">
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Last Login
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium mt-1">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-blue-50/50 dark:bg-blue-900/10">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Account Security</h3>
            <p className="text-xs text-blue-700 dark:text-blue-300 mb-4">You are currently logged in with {user.email}.</p>
            <Link href="/dashboard/profile/edit">
              <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400 font-semibold text-sm">
                Update account settings →
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
