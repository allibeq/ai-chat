import pb from '../pocketbase'
import type { MessageData } from '../schemas/dialogSchema'


export function fetchMessages(conversationId: string): Promise<MessageData[]> {
    return pb.collection('messages').getFullList<MessageData>({
        filter: `conversation = "${conversationId}"`,
        sort:   'created',
    })
}

export function createMessage(
    conversationId: string,
    role: 'user' | 'agent',
    content: string,
): Promise<MessageData> {
    return pb.collection('messages').create<MessageData>({
        conversation: conversationId,
        role,
        content,
    })
}