import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, act } from '@testing-library/react'
import { createElement } from 'react'
import { queryKeys } from '../lib/queryKeys'
import type { MessageData } from '../lib/schemas/dialogSchema'

vi.mock('../lib/api/messages', () => ({
    createMessage: vi.fn(),
    fetchMessages: vi.fn(),
}))

vi.mock('../lib/api/ai', () => ({
    callAI: vi.fn(),
}))

vi.mock('../stores/uiStore', () => ({
    useUiStore: vi.fn((selector: any) => selector({
        activeConversationId: 'conv-1',
        sending:              false,
        setSending:           vi.fn(),
        setActiveConversation: vi.fn(),
    })),
}))

const makeWrapper = (queryClient: QueryClient) =>
    ({ children }: { children: React.ReactNode }) =>
        createElement(QueryClientProvider, { client: queryClient }, children)

describe('useSendMessage', () => {
    let queryClient: QueryClient

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
        })
        vi.clearAllMocks()
    })

    it('onMutate adds optimistic messages to cache', async () => {
        const { useSendMessage } = await import('../features/chat/hooks/useMessages')

        const existing: MessageData = {
            id: 'msg-1', conversation: 'conv-1', role: 'user',
            content: 'hello', created: '', updated: '',
        }
        queryClient.setQueryData(queryKeys.messages('conv-1'), [existing])

        const { result } = renderHook(() => useSendMessage(), {
            wrapper: makeWrapper(queryClient),
        })

        await act(async () => {
            result.current.mutate({ text: 'new message', convId: 'conv-1' })
        })

        const cached = queryClient.getQueryData<MessageData[]>(queryKeys.messages('conv-1'))

        expect(cached).toHaveLength(3)
        expect(cached?.[1].id).toMatch(/^temp-user-/)
        expect(cached?.[2].id).toMatch(/^temp-ai-/)
        expect(cached?.[1].content).toBe('new message')
        expect(cached?.[2].content).toBe('...')
    })

    it('onError rollback cache to previous state', async () => {
        const { createMessage } = await import('../lib/api/messages')
        const { callAI } = await import('../lib/api/ai')
        const { useSendMessage } = await import('../features/chat/hooks/useMessages')

        vi.mocked(createMessage).mockResolvedValueOnce({
            id: 'real-msg', conversation: 'conv-1', role: 'user',
            content: 'test', created: '', updated: '',
        })
        vi.mocked(callAI).mockRejectedValue(new Error('AI unavailable'))

        const initial: MessageData[] = [{
            id: 'msg-1', conversation: 'conv-1', role: 'user',
            content: 'previous', created: '', updated: '',
        }]
        queryClient.setQueryData(queryKeys.messages('conv-1'), initial)

        const { result } = renderHook(() => useSendMessage(), {
            wrapper: makeWrapper(queryClient),
        })

        await act(async () => {
            await result.current.mutateAsync({ text: 'test', convId: 'conv-1' }).catch(() => {})
        })

        const cached = queryClient.getQueryData<MessageData[]>(queryKeys.messages('conv-1'))
        expect(cached).toEqual(initial)
    })
})