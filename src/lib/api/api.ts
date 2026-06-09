import pb from '../pocketbase'
import type { ConversationData } from '../schemas/dialogSchema'
import type { MessageData } from '../schemas/dialogSchema'

export async function fetchConversations(): Promise<ConversationData[]> {
    return pb.collection('conversations').getFullList<ConversationData>({
        filter: `user = "${pb.authStore.record?.id}"`,
        sort:   '-created',
    })
}

export async function createConversation(title: string): Promise<ConversationData> {
    return pb.collection('conversations').create<ConversationData>({
        title,
        user: pb.authStore.record?.id,
    })
}

export async function renameConversation(id: string, title: string): Promise<ConversationData> {
    return pb.collection('conversations').update<ConversationData>(id, { title })
}

export async function deleteConversation(id: string): Promise<void> {
    await pb.collection('conversations').delete(id)
}

export async function fetchMessages(conversationId: string): Promise<MessageData[]> {
    return pb.collection('messages').getFullList<MessageData>({
        filter: `conversation = "${conversationId}"`,
        sort:   'created',
    })
}

export async function createMessage(
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

export async function callAI(message: string): Promise<string> {
    const reply = await window.electron.callAI(message)
    if (!reply) throw new Error('Empty response from AI server.')
    return reply
}