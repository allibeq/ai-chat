import { useState } from 'react'
import Edit3 from '@/assets/edit-3.svg?react'
import Remove2 from '@/assets/delete-2.svg?react'
import type { ConversationData } from '../../../lib/schemas/dialogSchema'

type Props = {
    conversation:  ConversationData
    isActive:      boolean
    onSelect:      (id: string) => void
    onRename:      (id: string, title: string) => void
    onDelete:      (id: string) => void
}

export function ConversationItem({ conversation, isActive, onSelect, onRename, onDelete }: Props) {
    const [editingTitle, setEditingTitle] = useState('')
    const [isEditing, setIsEditing]       = useState(false)

    const startEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingTitle(conversation.title)
        setIsEditing(true)
    }

    const submitRename = () => {
        const title = editingTitle.trim()
        if (title) onRename(conversation.id, title)
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter')  submitRename()
        if (e.key === 'Escape') setIsEditing(false)
    }

    return (
        <div
            onClick={() => onSelect(conversation.id)}
            className={`group flex items-center px-5 py-3 cursor-pointer text-sm transition-colors
                        ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}
            `}
        >
            {isEditing ? (
                <input
                    autoFocus
                    className="flex-1 bg-transparent border-b border-amber-400 text-white text-sm outline-none"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={submitRename}
                    onKeyDown={handleKeyDown}
                    onClick={e => e.stopPropagation()}
                />
            ) : (
                <>
                    <span className="flex-1 truncate">{conversation.title}</span>

                    <div className="hidden group-hover:flex gap-1 shrink-0">
                        <button
                            onClick={startEdit}
                            className="text-white/30 text-xs px-1 cursor-pointer"
                        >
                            <Edit3 className="size-5 invert opacity-80" />
                        </button>
                        <button
                            onClick={e => { e.stopPropagation(); onDelete(conversation.id) }}
                            className="text-white/30 hover:text-amber-400 text-xs px-1 cursor-pointer"
                        >
                            <Remove2 className="size-5 invert opacity-80" />
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}