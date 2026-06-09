import {z} from 'zod';

const recordBase = z.object({
    id:      z.string(),
    created: z.string(),
    updated: z.string(),
})

export const conversationSchema = recordBase.extend({
    title: z.string(),
    user:  z.string(),
})

export const messageSchema = recordBase.extend({
    conversation: z.string(),
    role:         z.enum(['user', 'agent']),
    content:      z.string(),
})

export const aiResponseSchema = z.object({
    reply: z.string(),
})

export type ConversationData = z.infer<typeof conversationSchema>
export type MessageData      = z.infer<typeof messageSchema>