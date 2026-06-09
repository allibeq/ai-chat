import type { MessageData } from '../../../lib/schemas/dialogSchema'
import ReactMarkdown from 'react-markdown'
import type { ReactNode } from 'react'

const markdownComponents = {
    p:      ({ children }: { children?: ReactNode }) => <p className="mb-1 last:mb-0">{children}</p>,
    code:   ({ children }: { children?: ReactNode }) => <code className="bg-black/30 px-1 rounded text-amber-300 text-xs font-mono">{children}</code>,
    pre:    ({ children }: { children?: ReactNode }) => <pre className="bg-black/30 p-2 rounded mt-1 overflow-x-auto text-xs font-mono">{children}</pre>,
    ul:     ({ children }: { children?: ReactNode }) => <ul className="list-disc pl-4 mt-1">{children}</ul>,
    ol:     ({ children }: { children?: ReactNode }) => <ol className="list-decimal pl-4 mt-1">{children}</ol>,
    strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold">{children}</strong>,
}

function MessageItem({ msg }: { msg: MessageData }) {
    const isPending = msg.id.startsWith('pending-')
    const isOptimistic = msg.id.startsWith('temp-')
    const isTyping = isOptimistic && msg.role === 'agent' && msg.content === '...'

    return (
        <div className={`flex pb-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm transition-opacity ${
                    msg.role === 'user'
                        ? 'bg-amber-400 text-black rounded-br-sm'
                        : 'bg-white/10 text-white rounded-bl-sm'
                } ${isOptimistic || isPending ? 'opacity-70' : 'opacity-100'}`}
            >
                {isTyping ? (
                    <span className="flex gap-1 items-center h-4">
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:300ms]" />
                    </span>
                ) : msg.role === 'agent' ? (
                    <ReactMarkdown components={markdownComponents}>{msg.content}</ReactMarkdown>
                ) : (
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                )}
            </div>
        </div>
    )
}

export default MessageItem