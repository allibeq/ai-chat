import pb from '../pocketbase'
import type { ConversationData } from '../schemas/dialogSchema'

export function fetchConversations(): Promise<ConversationData[]> {
    return pb.collection('conversations').getFullList<ConversationData>({
        filter: `user = "${pb.authStore.record?.id}"`,
        sort:   '-created',
    })
}

export function createConversation(title: string): Promise<ConversationData> {
    return pb.collection('conversations').create<ConversationData>({
        title,
        user: pb.authStore.record?.id,
    })
}

export function renameConversation(id: string, title: string): Promise<ConversationData> {
    return pb.collection('conversations').update<ConversationData>(id, { title })
}

export async function deleteConversation(id: string): Promise<void> {
    await pb.collection('conversations').delete(id)
}