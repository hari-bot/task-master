"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Layers, LayoutDashboard, ListTodo } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center gap-6 lg:gap-10">
      <Link href="/" className="flex items-center gap-2 font-bold">
        <Layers className="h-6 w-6 text-primary" />
        <span className="hidden md:inline-block">TaskMaster</span>
      </Link>
      <nav className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="ghost" className={cn("gap-2", pathname === "/dashboard" && "bg-muted")}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden md:inline-block">Dashboard</span>
          </Button>
        </Link>
        <Link href="/dashboard/projects">
          <Button variant="ghost" className={cn("gap-2", pathname.includes("/dashboard/projects") && "bg-muted")}>
            <Layers className="h-4 w-4" />
            <span className="hidden md:inline-block">Projects</span>
          </Button>
        </Link>
        <Link href="/dashboard/tasks">
          <Button variant="ghost" className={cn("gap-2", pathname === "/dashboard/tasks" && "bg-muted")}>
            <ListTodo className="h-4 w-4" />
            <span className="hidden md:inline-block">Tasks</span>
          </Button>
        </Link>
      </nav>
    </div>
  )
}
