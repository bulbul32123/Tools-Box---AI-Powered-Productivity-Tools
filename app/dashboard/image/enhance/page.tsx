"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { ImageUpload } from "@/components/image/image-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ZapIcon, DownloadIcon, RefreshCwIcon } from "lucide-react"
import { useUser } from "@/hooks/use-user"

export default function EnhanceImagePage() {
  const { user } = useUser()
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [enhancementType, setEnhancementType] = useState<string>("quality")

  const enhancementOptions = [
    { value: "quality", label: "Improve Quality", description: "Enhance overall image quality" },
    { value: "resolution", label: "Upscale Resolution", description: "Increase image resolution 2x" },
    { value: "denoise", label: "Remove Noise", description: "Reduce image noise and grain" },
    { value: "sharpen", label: "Sharpen Details", description: "Enhance image sharpness" },
  ]

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
      }, 300)

      // Mock API call - replace with actual API
      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("enhancement_type", enhancementType)

      const response = await fetch("/api/image/enhance", {
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
        setError(errorData.error || "Failed to enhance image")
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
    link.download = `${selectedImage?.name.split(".")[0]}_enhanced.jpg`
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
              <ZapIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Enhance Image</h1>
              <p className="text-muted-foreground text-pretty">Improve image quality and resolution with AI</p>
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

        {/* Enhancement Options */}
        {selectedImage && !processedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Enhancement Options</CardTitle>
              <CardDescription>Choose how you want to enhance your image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enhancement-type">Enhancement Type</Label>
                <Select value={enhancementType} onValueChange={setEnhancementType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select enhancement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {enhancementOptions.map((option) => (
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
                <Button onClick={handleProcessImage} disabled={isProcessing} size="lg" className="min-w-40">
                  {isProcessing ? "Enhancing..." : "Enhance Image"}
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
        {processedImage && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>Your enhanced image</CardDescription>
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

                {/* Enhanced Image */}
                <div className="space-y-2">
                  <h3 className="font-medium">Enhanced</h3>
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img
                      src={processedImage || "/placeholder.svg"}
                      alt="Enhanced"
                      className="w-full h-full object-contain"
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
                  Enhance Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
