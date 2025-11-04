import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

interface ToolCardProps {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href: string
  category: string
}

export function ToolCard({ title, description, icon: Icon, href }: ToolCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-pretty">{description}</CardDescription>
        <Button asChild className="w-full">
          <Link href={href}>Get Started</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
