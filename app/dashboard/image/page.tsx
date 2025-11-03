import { requireAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolCard } from "@/components/dashboard/tool-card"
import { SparklesIcon, ZapIcon, RefreshCwIcon, RotateCcwIcon } from "lucide-react"

export default async function ImageToolsPage() {
  const user = await requireAuth()

  const imageTools = [
    {
      id: "remove-bg",
      title: "Remove Background",
      description: "Instantly remove backgrounds from images using AI",
      icon: SparklesIcon,
      href: "/dashboard/image/remove-bg",
      category: "image",
    },
    {
      id: "enhance",
      title: "Enhance Image",
      description: "Improve image quality and resolution with AI",
      icon: ZapIcon,
      href: "/dashboard/image/enhance",
      category: "image",
    },
    {
      id: "compose",
      title: "Image Compose",
      description: "Combine and edit multiple images together",
      icon: RefreshCwIcon,
      href: "/dashboard/image/compose",
      category: "image",
    },
    {
      id: "convert",
      title: "Format Convert",
      description: "Convert between different image formats",
      icon: RotateCcwIcon,
      href: "/dashboard/image/convert",
      category: "image",
    },
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Image Tools</h1>
          <p className="text-muted-foreground text-pretty">
            Powerful AI-driven tools for image processing and enhancement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {imageTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
