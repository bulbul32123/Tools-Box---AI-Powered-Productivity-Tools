"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FileUpload } from "@/components/file/file-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileIcon, DownloadIcon, RefreshCwIcon } from "lucide-react"
import { useUser } from "@/hooks/use-user"

export default function PDFConverterPage() {
  const { user } = useUser()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [convertedFile, setConvertedFile] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [outputFormat, setOutputFormat] = useState<string>("docx")

  const outputFormats = [
    { value: "docx", label: "DOCX", description: "Microsoft Word Document" },
    { value: "txt", label: "TXT", description: "Plain Text" },
    { value: "html", label: "HTML", description: "Web Page" },
    { value: "rtf", label: "RTF", description: "Rich Text Format" },
    { value: "jpg", label: "JPG", description: "JPEG Images (per page)" },
    { value: "png", label: "PNG", description: "PNG Images (per page)" },
  ]

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setConvertedFile(null)
    setError("")
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setConvertedFile(null)
    setError("")
  }

  const handleConvert = async () => {
    if (!selectedFile) return

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
          return prev + 12
        })
      }, 400)

      // Mock API call - replace with actual API
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("output_format", outputFormat)

      const response = await fetch("/api/file/convert/pdf", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProcessingProgress(100)

      if (response.ok) {
        const blob = await response.blob()
        const fileUrl = URL.createObjectURL(blob)
        setConvertedFile(fileUrl)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to convert file")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleDownload = () => {
    if (!convertedFile) return

    const link = document.createElement("a")
    link.href = convertedFile
    const extension = outputFormats.find((f) => f.value === outputFormat)?.value || "docx"
    link.download = `${selectedFile?.name.split(".")[0]}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setConvertedFile(null)
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
              <FileIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">PDF Converter</h1>
              <p className="text-muted-foreground text-pretty">Convert PDF files to various formats</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <FileUpload
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
          selectedFile={selectedFile}
          isProcessing={isProcessing}
          processingProgress={processingProgress}
          acceptedFormats={["application/pdf", ".pdf"]}
          title="Upload a PDF file"
          description="Drag and drop your PDF document or click to browse"
        />

        {/* Conversion Options */}
        {selectedFile && !convertedFile && (
          <Card>
            <CardHeader>
              <CardTitle>Conversion Options</CardTitle>
              <CardDescription>Choose the output format for your converted file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="output-format">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent>
                    {outputFormats.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="space-y-1">
                          <div className="font-medium">{format.label}</div>
                          <div className="text-sm text-muted-foreground">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center pt-4">
                <Button onClick={handleConvert} disabled={isProcessing} size="lg" className="min-w-40">
                  {isProcessing ? "Converting..." : "Convert File"}
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

        {/* Results Section */}
        {convertedFile && (
          <Card>
            <CardHeader>
              <CardTitle>Conversion Complete</CardTitle>
              <CardDescription>Your file has been successfully converted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {selectedFile?.name.split(".")[0]}.{outputFormats.find((f) => f.value === outputFormat)?.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Converted to {outputFormats.find((f) => f.value === outputFormat)?.label}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={handleDownload} className="min-w-32">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Convert Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
