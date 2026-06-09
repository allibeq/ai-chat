import { z } from 'zod'
import pb from '../pocketbase'
import { messageSchema } from '../schemas/dialogSchema'
import type { MessageData } from '../schemas/dialogSchema'

export async function fetchMessages(conversationId: string): Promise<MessageData[]> {
    const raw = await pb.collection('messages').getFullList({
        filter: `conversation = "${conversationId}"`,
        sort:   'created',
    })
    return z.array(messageSchema).parse(raw);
}

export async function createMessage(
    conversationId: string,
    role: 'user' | 'agent',
    content: string,
): Promise<MessageData> {
    const raw = await pb.collection('messages').create({
        conversation: conversationId,
        role,
        content,
    })
    return messageSchema.parse(raw);
}