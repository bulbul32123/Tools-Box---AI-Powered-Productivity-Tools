"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PDFUpload } from "@/components/pdf/pdf-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { DownloadIcon, FileTextIcon, TrashIcon, EyeIcon } from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface UploadedPDF {
  id: string
  name: string
  size: number
  uploadDate: string
  pages: number
  status: "processing" | "ready" | "error"
}

export default function UploadPDFPage() {
  const { user } = useUser()
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [uploadedPDFs, setUploadedPDFs] = useState<UploadedPDF[]>([
    {
      id: "1",
      name: "Sample Document.pdf",
      size: 2048576,
      uploadDate: "2024-01-15",
      pages: 12,
      status: "ready",
    },
    {
      id: "2",
      name: "Research Paper.pdf",
      size: 5242880,
      uploadDate: "2024-01-14",
      pages: 25,
      status: "ready",
    },
  ])

  const handlePDFSelect = (file: File) => {
    setSelectedPDF(file)
    setError("")
  }

  const handlePDFRemove = () => {
    setSelectedPDF(null)
    setError("")
  }

  const handleUpload = async () => {
    if (!selectedPDF) return

    setIsUploading(true)
    setUploadProgress(0)
    setError("")

    try {
      // Simulate upload with progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Mock API call - replace with actual API
      const formData = new FormData()
      formData.append("pdf", selectedPDF)

      const response = await fetch("/api/pdf/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (response.ok) {
        const data = await response.json()
        const newPDF: UploadedPDF = {
          id: Date.now().toString(),
          name: selectedPDF.name,
          size: selectedPDF.size,
          uploadDate: new Date().toISOString().split("T")[0],
          pages: data.pages || 1,
          status: "ready",
        }
        setUploadedPDFs((prev) => [newPDF, ...prev])
        setSelectedPDF(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to upload PDF")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDelete = (id: string) => {
    setUploadedPDFs((prev) => prev.filter((pdf) => pdf.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <DownloadIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Upload PDF</h1>
              <p className="text-muted-foreground text-pretty">Upload and manage your PDF documents</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <PDFUpload
          onPDFSelect={handlePDFSelect}
          onPDFRemove={handlePDFRemove}
          selectedPDF={selectedPDF}
          isProcessing={isUploading}
          processingProgress={uploadProgress}
        />

        {/* Upload Button */}
        {selectedPDF && (
          <div className="flex justify-center">
            <Button onClick={handleUpload} disabled={isUploading} size="lg" className="min-w-40">
              {isUploading ? "Uploading..." : "Upload PDF"}
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Uploaded PDFs */}
        <Card>
          <CardHeader>
            <CardTitle>Your Documents</CardTitle>
            <CardDescription>Manage your uploaded PDF documents</CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedPDFs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileTextIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploadedPDFs.map((pdf) => (
                  <div key={pdf.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileTextIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{pdf.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(pdf.size)}</span>
                          <span>{pdf.pages} pages</span>
                          <span>Uploaded {formatDate(pdf.uploadDate)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={pdf.status === "ready" ? "default" : "secondary"}>
                        {pdf.status === "ready" ? "Ready" : "Processing"}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(pdf.id)}>
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
