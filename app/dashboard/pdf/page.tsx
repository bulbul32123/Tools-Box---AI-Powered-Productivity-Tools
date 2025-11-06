import { requireAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolCard } from "@/components/dashboard/tool-card"
import { DownloadIcon, MessageSquareIcon, FileSearchIcon } from "lucide-react"

export default async function PDFToolsPage() {
  const user = await requireAuth()

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

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">PDF Tools</h1>
          <p className="text-muted-foreground text-pretty">Powerful AI-driven tools for PDF processing and analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
