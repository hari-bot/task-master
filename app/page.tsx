import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Clock, Layers } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Layers className="h-6 w-6 text-primary" />
            <span>TaskMaster</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Manage Your Tasks with Precision
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    TaskMaster helps you organize projects, track progress, and collaborate with your team efficiently.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="gap-1.5">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline">
                      Login
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Multiple Projects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Task Tracking</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>Progress Analytics</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[450px] overflow-hidden rounded-lg border bg-gradient-to-b from-background/10 to-background/50 p-6 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background/20 opacity-50"></div>
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold">Website Redesign</h3>
                        <p className="text-xs text-muted-foreground">8 tasks remaining</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Due in 5 days</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="rounded-md border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Design Homepage</div>
                          <div className="rounded-full px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            Completed
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Implement Navigation</div>
                          <div className="rounded-full px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            In Progress
                          </div>
                        </div>
                      </div>
                      <div className="rounded-md border bg-card p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Create Contact Form</div>
                          <div className="rounded-full px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            To Do
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Features that Empower Your Workflow
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  TaskMaster provides all the tools you need to manage your projects efficiently.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Multiple Projects</h3>
                <p className="text-center text-muted-foreground">
                  Manage up to 4 different projects simultaneously with ease.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Task Management</h3>
                <p className="text-center text-muted-foreground">
                  Create, update, and track tasks with detailed descriptions and status updates.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-card p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Progress Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Monitor task completion dates and track your project progress over time.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Layers className="h-5 w-5 text-primary" />
            <span>TaskMaster</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} TaskMaster. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
