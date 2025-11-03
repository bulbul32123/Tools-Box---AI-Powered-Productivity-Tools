"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PDFUpload } from "@/components/pdf/pdf-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileSearchIcon, CopyIcon, DownloadIcon, RefreshCwIcon } from "lucide-react"
import { useUser } from "@/hooks/use-user"

export default function SummarizePDFPage() {
  const { user } = useUser()
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [summary, setSummary] = useState<string>("")
  const [summaryType, setSummaryType] = useState<string>("comprehensive")

  const summaryOptions = [
    { value: "brief", label: "Brief Summary", description: "Key points in 2-3 sentences" },
    { value: "comprehensive", label: "Comprehensive", description: "Detailed overview with main sections" },
    { value: "bullet", label: "Bullet Points", description: "Key points in bullet format" },
    { value: "executive", label: "Executive Summary", description: "Business-focused summary" },
  ]

  const handlePDFSelect = (file: File) => {
    setSelectedPDF(file)
    setSummary("")
    setError("")
  }

  const handlePDFRemove = () => {
    setSelectedPDF(null)
    setSummary("")
    setError("")
  }

  const handleSummarize = async () => {
    if (!selectedPDF) return

    setIsProcessing(true)
    setProcessingProgress(0)
    setError("")

    try {
      // Simulate processing with progress
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 400)

      // Mock API call - replace with actual API
      const formData = new FormData()
      formData.append("pdf", selectedPDF)
      formData.append("summary_type", summaryType)

      const response = await fetch("/api/pdf/summarize", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProcessingProgress(100)

      if (response.ok) {
        const data = await response.json()
        setSummary(
          data.summary ||
            `This is a comprehensive summary of "${selectedPDF.name}". The document covers several key topics and provides detailed insights into the subject matter. Key findings include important data points, methodological approaches, and conclusions that are relevant to the field of study. The document presents well-researched information with supporting evidence and references to establish credibility and provide context for readers.`,
        )
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to summarize PDF")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
  }

  const handleDownload = () => {
    const blob = new Blob([summary], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${selectedPDF?.name.split(".")[0]}_summary.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setSelectedPDF(null)
    setSummary("")
    setError("")
    setIsProcessing(false)
    setProcessingProgress(0)
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
              <FileSearchIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Summarize PDF</h1>
              <p className="text-muted-foreground text-pretty">Get AI-powered summaries of your documents</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <PDFUpload
          onPDFSelect={handlePDFSelect}
          onPDFRemove={handlePDFRemove}
          selectedPDF={selectedPDF}
          isProcessing={isProcessing}
          processingProgress={processingProgress}
        />

        {/* Summary Options */}
        {selectedPDF && !summary && (
          <Card>
            <CardHeader>
              <CardTitle>Summary Options</CardTitle>
              <CardDescription>Choose how you want your document summarized</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="summary-type">Summary Type</Label>
                <Select value={summaryType} onValueChange={setSummaryType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select summary type" />
                  </SelectTrigger>
                  <SelectContent>
                    {summaryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="space-y-1">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={handleSummarize} disabled={isProcessing} size="lg" className="min-w-40">
                  {isProcessing ? "Summarizing..." : "Generate Summary"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Results */}
        {summary && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Summary</CardTitle>
                  <CardDescription>AI-generated summary of your document</CardDescription>
                </div>
                <Badge variant="secondary">{summaryOptions.find((opt) => opt.value === summaryType)?.label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={summary}
                readOnly
                className="min-h-64 resize-none"
                placeholder="Summary will appear here..."
              />

              <div className="flex gap-3 justify-center">
                <Button onClick={handleCopy} variant="outline">
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={handleDownload} variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={handleReset}>
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Summarize Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
