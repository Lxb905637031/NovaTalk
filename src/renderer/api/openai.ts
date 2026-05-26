import OpenAI from 'openai'
import type { AIService } from '@/types/settings'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function chatCompletion(
  service: AIService,
  model: string,
  messages: Message[],
  onStream: (content: string) => void
): Promise<void> {
  const openai = new OpenAI({
    apiKey: service.apiKey,
    baseURL: service.apiBaseUrl,
    dangerouslyAllowBrowser: true,
  })

  const stream = await openai.chat.completions.create({
    model,
    messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    stream: true,
    max_tokens: 2048,
    temperature: 0.7,
  })

  let fullContent = ''
  let chunkNum = 0

  for await (const chunk of stream) {
    chunkNum++
    if (chunk.choices && chunk.choices[0]?.delta?.content) {
      fullContent += chunk.choices[0].delta.content
      console.log(`[openai] Chunk ${chunkNum}: "${chunk.choices[0].delta.content}", total: ${fullContent.length}`)
      onStream(fullContent)
    }
  }

  console.log('[openai] Stream complete:', fullContent)
}
