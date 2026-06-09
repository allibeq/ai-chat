import { useUiStore } from '../../../stores/uiStore'
import { useMessages } from '../hooks/useMessages'
import { useChatSendMessage } from '../hooks/useChatSendMessage'
import { useChatDisplayMessage } from '../hooks/useChatDisplayMessage'
import EmptyState from '@/features/chat/components/EmptyState'
import MessageList from '@/features/chat/components/MessageList'
import ChatInput from '@/features/chat/components/ChatInput'
import {ErrorMessage} from "@/features/chat/components/ErrorMessage";

function ChatDialog() {
    const { activeConversationId } = useUiStore()

    const { data: messages, isLoading: loadingMessages, isError: messageError } =
        useMessages(activeConversationId)

    const {
        pending,
        showPending,
        sendMessage,
        handleRetry,
        isSending,
        isCreatingConversation,
    } = useChatSendMessage()

    const displayMessages = useChatDisplayMessage({
        messages,
        activeConversationId,
        pending,
        showPending,
    })

    const isEmpty =
        (!activeConversationId && !showPending) ||
        (!!activeConversationId && !loadingMessages && displayMessages.length === 0)

    const error =
        showPending && pending?.error
            ? {
                message: 'Failed to send. Please try again.',
                onRetry: () => handleRetry(pending.text),
            }
            : messageError
                ? { message: 'Failed to load messages.' }
                : null

    return (
        <div className="flex flex-1 flex-col h-full relative">
                {isEmpty ? (
                    <EmptyState />
                ) : (
                    <MessageList
                        key={activeConversationId ?? 'empty'}
                        messages={displayMessages}
                    />
                )}

                {error && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-25 z-13 flex justify-center">
                        <ErrorMessage message={error.message} onRetry={error.onRetry} />
                    </div>
                )}

            <div className="absolute inset-x-0 bottom-0 z-20">
                <ChatInput
                    dialogId={activeConversationId}
                    onSend={sendMessage}
                    disabled={isSending || isCreatingConversation || pending && !!pending?.error}
             />
            </div>
        </div>
    )
}

export default ChatDialog
