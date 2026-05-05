'use client'

import { useNotifications, useMarkNotificationsRead } from '@/app/hooks/useNotifications'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  CheckCircle2, 
  MessageSquare, 
  PlusCircle, 
  UserPlus, 
  AlertTriangle, 
  Clock,
  MoreVertical,
  Check,
  CheckCheck
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { NotificationType } from '@prisma/client'
import { useRouter } from 'next/navigation'

export default function NotificationsPage() {
  const router = useRouter()
  const { data: response, isLoading } = useNotifications()
  const { mutate: markRead } = useMarkNotificationsRead()
  const notifications = response?.data || []

  const handleMarkAllRead = () => {
    markRead({ all: true })
  }

  const handleMarkOneRead = (id: string) => {
    markRead({ ids: [id] })
  }

  const handleNotificationClick = (notification: { id: string; type: NotificationType; isRead: boolean; title: string; message: string; createdAt: string; taskId?: string; projectId?: string }) => {
    if (!notification.isRead) {
      handleMarkOneRead(notification.id)
    }
    
    if (notification.projectId) {
      if (notification.taskId) {
        router.push(`/dashboard/projects/${notification.projectId}/tasks/${notification.taskId}`)
      } else {
        router.push(`/dashboard/projects/${notification.projectId}`)
      }
    }
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return <PlusCircle className="h-5 w-5 text-blue-500" />
      case 'TASK_COMPLETED':
      case 'TASK_UPDATED':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'COMMENT_ADDED':
        return <MessageSquare className="h-5 w-5 text-purple-500" />
      case 'MEMBER_ADDED':
        return <UserPlus className="h-5 w-5 text-indigo-500" />
      case 'DEADLINE_APPROACHING':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case 'PROJECT_CREATED':
        return <PlusCircle className="h-5 w-5 text-teal-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTime = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated with your activities</p>
        </div>
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleMarkAllRead}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-2">
          <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">All caught up!</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">You have no new notifications.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification: { id: string; type: NotificationType; isRead: boolean; title: string; message: string; createdAt: string; taskId?: string; projectId?: string }) => (
            <Card 
              key={notification.id} 
              className={`p-4 transition-all hover:shadow-md cursor-pointer border border-gray-100 dark:border-gray-800 ${
                !notification.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10 border-l-4 border-l-blue-600' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-semibold truncate ${
                      !notification.isRead ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                    }`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  
                  {notification.projectId && (
                    <div className="mt-3">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200">
                        View {notification.taskId ? 'Task' : 'Project'}
                      </Badge>
                    </div>
                  )}
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!notification.isRead && (
                        <DropdownMenuItem 
                          className="gap-2 cursor-pointer"
                          onClick={() => handleMarkOneRead(notification.id)}
                        >
                          <Check className="h-4 w-4" /> Mark as read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 gap-2 cursor-pointer">
                        Delete notification
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
