"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PDFUpload } from "@/components/pdf/pdf-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquareIcon, SendIcon, UserIcon, BotIcon } from "lucide-react"
import { useUser } from "@/hooks/use-user"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: string
}

export default function ChatWithPDFPage() {
  const { user } = useUser()
  const [selectedPDF, setSelectedPDF] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string>("")
  const [pdfProcessed, setPdfProcessed] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handlePDFSelect = (file: File) => {
    setSelectedPDF(file)
    setPdfProcessed(false)
    setMessages([])
    setError("")
  }

  const handlePDFRemove = () => {
    setSelectedPDF(null)
    setPdfProcessed(false)
    setMessages([])
    setError("")
  }

  const handleProcessPDF = async () => {
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
          return prev + 15
        })
      }, 300)

      // Mock API call - replace with actual API
      const formData = new FormData()
      formData.append("pdf", selectedPDF)

      const response = await fetch("/api/pdf/process", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setProcessingProgress(100)

      if (response.ok) {
        setPdfProcessed(true)
        setMessages([
          {
            id: "1",
            type: "assistant",
            content: `I've successfully processed "${selectedPDF.name}". You can now ask me questions about the document content. What would you like to know?`,
            timestamp: new Date().toISOString(),
          },
        ])
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to process PDF")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsProcessing(false)
      setProcessingProgress(0)
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !pdfProcessed) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsSending(true)

    try {
      // Mock API call - replace with actual API
      const response = await fetch("/api/pdf/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputMessage,
          pdfId: selectedPDF?.name, // In real app, use actual PDF ID
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.response || "I understand your question about the document. Here's what I found...",
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        setError("Failed to get response. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
              <MessageSquareIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-balance">Chat with PDF</h1>
              <p className="text-muted-foreground text-pretty">Ask questions about your PDF content</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        {!pdfProcessed && (
          <>
            <PDFUpload
              onPDFSelect={handlePDFSelect}
              onPDFRemove={handlePDFRemove}
              selectedPDF={selectedPDF}
              isProcessing={isProcessing}
              processingProgress={processingProgress}
            />

            {selectedPDF && !pdfProcessed && (
              <div className="flex justify-center">
                <Button onClick={handleProcessPDF} disabled={isProcessing} size="lg" className="min-w-40">
                  {isProcessing ? "Processing..." : "Process PDF"}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Chat Interface */}
        {pdfProcessed && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* PDF Info */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Document</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                      <MessageSquareIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{selectedPDF?.name}</p>
                      <p className="text-xs text-muted-foreground">Ready for questions</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handlePDFRemove} className="w-full bg-transparent">
                    Upload Different PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chat */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Chat</CardTitle>
                <CardDescription>Ask questions about your document</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages */}
                <ScrollArea className="h-96 w-full border rounded-lg p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">
                            {message.type === "user" ? (
                              <UserIcon className="h-4 w-4" />
                            ) : (
                              <BotIcon className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{message.type === "user" ? "You" : "Assistant"}</p>
                          <p className="text-sm text-pretty">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10">
                            <BotIcon className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Assistant</p>
                          <p className="text-sm text-muted-foreground">Thinking...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about your document..."
                    disabled={isSending}
                  />
                  <Button onClick={handleSendMessage} disabled={isSending || !inputMessage.trim()}>
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
