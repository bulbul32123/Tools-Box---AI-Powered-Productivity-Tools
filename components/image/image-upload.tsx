"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UploadIcon, XIcon, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onImageRemove: () => void
  selectedImage: File | null
  isProcessing?: boolean
  processingProgress?: number
  acceptedFormats?: string[]
  maxSize?: number
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  selectedImage,
  isProcessing = false,
  processingProgress = 0,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp"],
  maxSize = 10 * 1024 * 1024, // 10MB
}: ImageUploadProps) {
  const [error, setError] = useState<string>("")

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError("")

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0]
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`)
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("Invalid file type. Please upload a valid image file.")
        } else {
          setError("Invalid file. Please try again.")
        }
        return
      }

      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0])
      }
    },
    [onImageSelect, maxSize],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats.reduce((acc, format) => ({ ...acc, [format]: [] }), {}),
    maxSize,
    multiple: false,
    disabled: isProcessing,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {!selectedImage ? (
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50",
                isProcessing && "cursor-not-allowed opacity-50",
              )}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <UploadIcon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium">{isDragActive ? "Drop your image here" : "Upload an image"}</p>
                  <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                  <p className="text-xs text-muted-foreground">
                    Supports: {acceptedFormats.map((f) => f.split("/")[1].toUpperCase()).join(", ")} • Max{" "}
                    {maxSize / (1024 * 1024)}MB
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{selectedImage.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(selectedImage.size)}</p>
                  </div>
                </div>
                {!isProcessing && (
                  <Button variant="ghost" size="sm" onClick={onImageRemove}>
                    <XIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
