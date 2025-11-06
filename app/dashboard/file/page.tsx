import { requireAuth } from "@/lib/auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ToolCard } from "@/components/dashboard/tool-card"
import { FileTextIcon, FileIcon } from "lucide-react"

export default async function FileToolsPage() {
  const user = await requireAuth()

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
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">File Tools</h1>
          <p className="text-muted-foreground text-pretty">Convert between different file formats with ease</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fileTools.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
