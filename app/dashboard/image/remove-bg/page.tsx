"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ImageUpload } from "@/components/image/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SparklesIcon, DownloadIcon, RefreshCwIcon } from "lucide-react"
import { useUser } from "@/hooks/use-user"

export default function RemoveBackgroundPage() {
  const { user } = useUser()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string>("")

  const handleImageSelect = (file: File) => {
    setSelectedImage(file)
    setProcessedImage(null)
    setError("")
  }

  const handleImageRemove = () => {
    setSelectedImage(null)
    setProcessedImage(null)
    setError("")
  }

  const handleProcessImage = async () => {
    if (!selectedImage) return

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
      }, 200)

      // Mock API call - replace with actual API
      const formData = new FormData()
      formData.append("image", selectedImage)

      const response = await fetch("/api/image/remove-bg", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProcessingProgress(100)

      if (response.ok) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        setProcessedImage(imageUrl)
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to process image")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleDownload = () => {
    if (!processedImage) return

    const link = document.createElement("a")
    link.href = processedImage
    link.download = `${selectedImage?.name.split(".")[0]}_no_bg.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleReset = () => {
    setSelectedImage(null)
    setProcessedImage(null)
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
              <SparklesIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Remove Background</h1>
              <p className="text-muted-foreground text-pretty">Instantly remove backgrounds from images using AI</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <ImageUpload
          onImageSelect={handleImageSelect}
          onImageRemove={handleImageRemove}
          selectedImage={selectedImage}
          isProcessing={isProcessing}
          processingProgress={processingProgress}
        />

        {/* Process Button */}
        {selectedImage && !processedImage && (
          <div className="flex justify-center">
            <Button onClick={handleProcessImage} disabled={isProcessing} size="lg" className="min-w-40">
              {isProcessing ? "Processing..." : "Remove Background"}
            </Button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {processedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>Your image with background removed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Image */}
                <div className="space-y-2">
                  <h3 className="font-medium">Original</h3>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(selectedImage!) || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Processed Image */}
                <div className="space-y-2">
                  <h3 className="font-medium">Background Removed</h3>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden relative">
                    {/* Checkerboard pattern for transparency */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='10' height='10' fill='%23000'/%3e%3crect x='10' y='10' width='10' height='10' fill='%23000'/%3e%3c/svg%3e")`,
                      }}
                    />
                    <img
                      src={processedImage || "/placeholder.svg"}
                      alt="Background removed"
                      className="w-full h-full object-contain relative z-10"
                    />
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
                  Process Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
