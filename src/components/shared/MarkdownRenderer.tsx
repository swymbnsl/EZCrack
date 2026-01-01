"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import { useTheme } from "@/contexts/ThemeContext"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const { theme } = useTheme()
  const isLight = theme === "light"

  return (
    <div
      className={`prose ${
        isLight ? "prose-black" : "prose-invert"
      } max-w-none ${isLight ? "light-katex" : ""} ${
        isLight ? "text-[#2D2A32]" : "text-gray-200"
      } ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: false }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
