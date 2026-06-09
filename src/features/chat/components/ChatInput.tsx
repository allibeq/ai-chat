import {useEffect, useRef, useState} from 'react'
import type { KeyboardEvent } from 'react'

type Props = {
    onSend: (text: string) => void
    disabled?: boolean
    dialogId?: string | null
}

function ChatInput({ onSend, disabled, dialogId }: Props) {
    const [text, setText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [prevDialogId, setPrevDialogId] = useState(dialogId);

    if (dialogId !== prevDialogId) {
        setPrevDialogId(dialogId);
        setText('');
    }

    useEffect(() => {
        textareaRef.current?.focus()
    }, [disabled, dialogId])

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;
        onSend(trimmed);
        setText('');
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (disabled) return;
            handleSend();
        }
    }

    return (
        <div className="px-8 pb-6 flex items-center justify-center gap-3">
            <textarea
                className="border w-full max-w-2xl border-amber-400 px-5 py-3 bg-[var(--code-bg)] rounded-xl text-white placeholder:text-white/30 resize-none outline-none focus:border-amber-300 transition-colors sidebar-scroll"
                placeholder="How can I help you?"
                ref={textareaRef}
                rows={2}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button
                onClick={handleSend}
                disabled={disabled || !text.trim()}
                className="bg-amber-400 w-30 rounded-xl h-10 cursor-pointer hover:bg-amber-400/80 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity px-8 text-black font-medium"
            >
                Send
            </button>
        </div>
    )
}

export default ChatInput