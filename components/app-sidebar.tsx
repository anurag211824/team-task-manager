'use client'
import Link from "next/link"

import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  User,
  LogOut,
} from "lucide-react"
import { clearAuthCookies } from "@/lib/cookies"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      clearAuthCookies()
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <SidebarHeader className="border-b border-gray-200 dark:border-gray-800 px-6 py-2.5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-blue-500 to-blue-600">
            <span className="text-base font-bold text-white">TF</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">TaskFlow</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
  {navItems.map((item) => {
    // Exact match for the base route, otherwise check if it starts with the href
    const isActive = item.href === "/dashboard" 
      ? pathname === "/dashboard" 
      : pathname.startsWith(item.href);

    const Icon = item.icon;

    return (
      <SidebarMenuItem key={item.href}>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          className={`relative h-11 transition-all duration-200 ${
            isActive
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-semibold'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Link href={item.href} className="flex items-center gap-3">
            <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
            <span>{item.title}</span>
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  })}
</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-200 dark:border-gray-800 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-4 py-3.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-6 w-6 shrink-0" />
          <span className="font-medium text-base">Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}