import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchMessages, createMessage } from '@/lib/api/messages'
import { callAI } from '@/lib/api/ai'
import { useUiStore } from '../../../stores/uiStore'
import type { MessageData } from '../../../lib/schemas/dialogSchema'

export type SendMessageInput = {
    text: string
    convId: string
}

export function useMessages(conversationId: string | null) {
    return useQuery({
        queryKey: queryKeys.messages(conversationId ?? ''),
        queryFn:  () => fetchMessages(conversationId!),
        enabled:  !!conversationId,
        placeholderData: (previousData) => previousData,
    });
}

export function useSendMessage() {
    const queryClient = useQueryClient();
    const setSending  = useUiStore(s => s.setSending);

    return useMutation({
        onMutate: async ({ text, convId }: SendMessageInput) => {
            setSending(true);

            const cacheKey = queryKeys.messages(convId);
            await queryClient.cancelQueries({ queryKey: cacheKey });
            const previousMessages = queryClient.getQueryData<MessageData[]>(cacheKey);

            const optimisticUser: MessageData = {
                id:           `temp-user-${Date.now()}`,
                conversation: convId,
                role:         'user',
                content:      text,
                created:      new Date().toISOString(),
                updated:      new Date().toISOString(),
            };

            const optimisticAI: MessageData = {
                id:           `temp-ai-${Date.now()}`,
                conversation: convId,
                role:         'agent',
                content:      '...',
                created:      new Date().toISOString(),
                updated:      new Date().toISOString(),
            };

            queryClient.setQueryData<MessageData[]>(cacheKey, old => [
                ...(old ?? []),
                optimisticUser,
                optimisticAI,
            ]);

            return { previousMessages, convId };
        },

        mutationFn: async ({ text, convId }: SendMessageInput) => {
            const reply = await callAI(text);
            const userMsg= await createMessage(convId, 'user', text);
            const agentMsg = await createMessage(convId, 'agent', reply);
            return { messages: [userMsg, agentMsg], convId } as const;
        },

        onError: (_err, _input, context) => {
            if (!context) return;

            queryClient.setQueryData(
                queryKeys.messages(context.convId),
                context.previousMessages,
            )

        },

        onSuccess: ({ messages, convId }) => {
            queryClient.setQueryData<MessageData[]>(
                queryKeys.messages(convId),
                old => [
                    ...(old ?? []).filter(m => !m.id.startsWith('temp-')),
                    ...messages,
                ]
            );
        },

        onSettled: () => {
            setSending(false);
        },
    })
}
