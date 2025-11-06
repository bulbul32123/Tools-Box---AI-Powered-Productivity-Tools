import { requireAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolCard } from "@/components/dashboard/tool-card"
import {
  ImageIcon,
  FileTextIcon,
  FileIcon,
  SparklesIcon,
  ZapIcon,
  RefreshCwIcon,
  DownloadIcon,
  MessageSquareIcon,
  FileSearchIcon,
  RotateCcwIcon,
} from "lucide-react"

export default async function DashboardPage() {
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

  const pdfTools = [
    {
      id: "upload",
      title: "Upload PDF",
      description: "Upload and manage your PDF documents",
      icon: DownloadIcon,
      href: "/dashboard/pdf/upload",
      category: "pdf",
    },
    {
      id: "chat",
      title: "Chat with PDF",
      description: "Ask questions about your PDF content",
      icon: MessageSquareIcon,
      href: "/dashboard/pdf/chat",
      category: "pdf",
    },
    {
      id: "summarize",
      title: "Summarize PDF",
      description: "Get AI-powered summaries of your documents",
      icon: FileSearchIcon,
      href: "/dashboard/pdf/summarize",
      category: "pdf",
    },
  ]

  const fileTools = [
    {
      id: "docx-convert",
      title: "DOCX Converter",
      description: "Convert DOCX files to PDF, TXT, and more",
      icon: FileTextIcon,
      href: "/dashboard/file/docx-convert",
      category: "file",
    },
    {
      id: "pdf-convert",
      title: "PDF Converter",
      description: "Convert PDF files to various formats",
      icon: FileIcon,
      href: "/dashboard/file/pdf-convert",
      category: "file",
    },
    {
      id: "txt-convert",
      title: "Text Converter",
      description: "Convert text files between formats",
      icon: FileTextIcon,
      href: "/dashboard/file/txt-convert",
      category: "file",
    },
  ]

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Welcome back, {user.name}</h1>
          <p className="text-muted-foreground text-pretty">
            Choose from our powerful AI tools to enhance your productivity
          </p>
        </div>

        {/* Image Tools Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Image Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {imageTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </section>

        {/* PDF Tools Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <FileTextIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">PDF Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pdfTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </section>

        {/* File Tools Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <FileIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">File Tools</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fileTools.map((tool) => (
              <ToolCard key={tool.id} {...tool} />
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
