import { useState } from 'react'
import { useUiStore } from '@/stores/uiStore'
import { useCreateConversation } from './useConversation'
import { useSendMessage } from './useMessages'
import { matchesActiveDialog } from '../types/pending'
import type { PendingSend, PendingMap } from '../types/pending'
import { queryKeys } from "@/lib/queryKeys";
import type { MessageData } from "../../../lib/schemas/dialogSchema";
import {useQueryClient} from "@tanstack/react-query";

export function useChatSendMessage() {
    const { activeConversationId, setActiveConversation } = useUiStore();

    const { mutate: createConversation, isPending: isCreatingConversation } =
        useCreateConversation();

    const { mutate: sendNewMessage, isPending: isSending } =
        useSendMessage();

    const [pendingMap, setPendingMap] = useState<PendingMap>({});

    const pendingKey = activeConversationId ?? 'new';
    const pending = pendingMap[pendingKey] ?? null;
    const showPending = pending != null && matchesActiveDialog(pending, activeConversationId);

    const updatePending = (
        key: string,
        value: PendingSend | ((p: PendingSend | null) => PendingSend | null) | null
    ) => {
        setPendingMap(prev => {
            const resolved = typeof value === 'function' ? value(prev[key] ?? null) : value;
            if (resolved === null) {
                const next = { ...prev };
                delete next[key];
                return next;
            }
            return { ...prev, [key]: resolved };
        });
    };

    const sendMessage = (trimmed: string) => {
        if (!activeConversationId) {
            const title = trimmed.slice(0, 20).replace(/^./, c => c.toUpperCase());

            updatePending('new', { text: trimmed, targetConvId: null, error: null });

            createConversation(title, {
                onSuccess: (conversation) => {
                    updatePending(conversation.id, { text: trimmed, targetConvId: conversation.id, error: null });
                    updatePending('new', null);
                    setActiveConversation(conversation.id);

                    sendNewMessage(
                        { text: trimmed, convId: conversation.id },
                        {
                            onSuccess: () => updatePending(conversation.id, null),
                            onError:   () => updatePending(conversation.id,{
                                text:         trimmed,
                                targetConvId: conversation.id,
                                error:        'send',
                            }),
                        },
                    );
                },
                onError: () => {
                    updatePending('new', pending => pending ? { ...pending, error: 'create' } : null);
                },
            })
        } else {
            sendNewMessage(
                { text: trimmed, convId: activeConversationId },
                {
                    onError:   () => updatePending(activeConversationId, {
                        text:         trimmed,
                        targetConvId: activeConversationId,
                        error:        'send',
                    }),
                },
            );
        }
    }

    const queryClient= useQueryClient();

    const handleRetry = (text: string) => {
        updatePending(pendingKey, null);
        const cacheKey = queryKeys.messages(activeConversationId ?? '')
        queryClient.setQueryData<MessageData[]>(
            cacheKey,
            (old) => (old ?? []).filter(msg => !msg.id.startsWith('temp-'))
        )
        sendMessage(text);
    }

    return {
        pending,
        showPending,
        sendMessage,
        handleRetry,
        isSending,
        isCreatingConversation,
    }
}