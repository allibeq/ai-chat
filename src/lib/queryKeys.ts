export const queryKeys = {
    conversations: () => ['conversations'] as const,
    messages: (convId: string) => ['messages', convId] as const,
}
