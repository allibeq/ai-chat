import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../lib/queryKeys'
import { fetchConversations, createConversation, renameConversation, deleteConversation } from '@/lib/api/conversations'
import { useUiStore } from '../../../stores/uiStore'

export function useConversations() {
    return useQuery({
        queryKey: queryKeys.conversations(),
        queryFn:  fetchConversations,
        placeholderData: (previousData) => previousData,
    });
}

export function useCreateConversation() {
    const queryClient= useQueryClient();
    const setActiveConversation= useUiStore(s => s.setActiveConversation);

    return useMutation({
        mutationFn: (title: string) => createConversation(title),
        onSuccess: (newConv) => {
            queryClient.setQueryData(
                queryKeys.conversations(),
                (old: Awaited<ReturnType<typeof fetchConversations>> = []) =>
                    [newConv, ...old],
            );
            setActiveConversation(newConv.id);
        },
    });
}

export function useRenameConversation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, title }: { id: string; title: string }) =>
            renameConversation(id, title),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.conversations() });
        },
    });
}

export function useDeleteConversation() {
    const queryClient  = useQueryClient();
    const { activeConversationId, setActiveConversation } = useUiStore();

    return useMutation({
        mutationFn: (id: string) => deleteConversation(id),
        onSuccess: (_, deletedId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.conversations() });
            if (activeConversationId === deletedId) setActiveConversation(null);
        },
    });
}