import { ConversationItem } from './ConversationItem'
import type { ConversationData } from '../../../lib/schemas/dialogSchema'

type Props = {
    conversations:         ConversationData[]
    activeConversationId:  string | null
    onSelect:              (id: string) => void
    onRename:              (id: string, title: string) => void
    onDelete:              (id: string) => void
}

export function ConversationList({ conversations, activeConversationId, onSelect, onRename, onDelete }: Props) {
    return (
        <>
            {conversations.map(conversation => (
                <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={activeConversationId === conversation.id}
                    onSelect={onSelect}
                    onRename={onRename}
                    onDelete={onDelete}
                />
            ))}
        </>
    )
}

