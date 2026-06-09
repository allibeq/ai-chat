import { z } from 'zod'
import pb from '../pocketbase'
import { conversationSchema } from '../schemas/dialogSchema'
import type { ConversationData } from '../schemas/dialogSchema'

export async function fetchConversations(): Promise<ConversationData[]> {
    const raw = await pb.collection('conversations').getFullList({
        filter: `user = "${pb.authStore.record?.id}"`,
        sort:   '-created',
    })
    return z.array(conversationSchema).parse(raw)
}

export async function createConversation(title: string): Promise<ConversationData> {
    const raw = await pb.collection('conversations').create({
        title,
        user: pb.authStore.record?.id,
    })
    return conversationSchema.parse(raw)
}

export async function renameConversation(id: string, title: string): Promise<ConversationData> {
    const raw = await pb.collection('conversations').update(id, { title })
    return conversationSchema.parse(raw)
}

export async function deleteConversation(id: string): Promise<void> {
    await pb.collection('conversations').delete(id)
}