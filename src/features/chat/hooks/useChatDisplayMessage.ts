import type { MessageData } from '../../../lib/schemas/dialogSchema'
import type { PendingSend } from '../types/pending'

type Params = {
    messages:             MessageData[] | undefined
    activeConversationId: string | null
    pending:              PendingSend | null
    showPending:          boolean
}

export function useChatDisplayMessage({ messages, activeConversationId, pending, showPending }: Params) {
    const filteredMessages = (messages ?? []).filter(
        msg => msg.conversation === activeConversationId
    )

    const hasOptimisticMessage = filteredMessages.some(
        msg => msg.role === 'user' && msg.content === pending?.text
    )

    const pendingItem: MessageData[] = showPending && !hasOptimisticMessage
        ? [{
            id:           'pending-user',
            conversation: pending!.targetConvId ?? '',
            role:         'user',
            content:      pending!.text,
            created:      new Date().toISOString(),
            updated:      new Date().toISOString(),
        }]
        : []

    return [...filteredMessages, ...pendingItem]
}