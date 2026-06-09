import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import ChatBar from "@/features/chat/conv-bar/ChatBar";
import ChatDialog from "@/features/chat/dialog/ChatDialog";
import { fetchConversations, fetchMessages, deleteConversation } from '@/lib/api/api'
import { queryKeys } from '@/lib/queryKeys'

function ChatMainPage() {
    const queryClient = useQueryClient()

    useEffect(() => {
        const cleanup = async () => {
            const conversations = await fetchConversations()
            await Promise.all(
                conversations.map(async (conv) => {
                    const messages = await fetchMessages(conv.id)
                    if (messages.length === 0) {
                        await deleteConversation(conv.id)
                    }
                })
            )
            queryClient.invalidateQueries({ queryKey: queryKeys.conversations() })
        }

        cleanup().catch(() => {})
    }, [])

  return (
      <>
          <div className="flex h-screen">
              <ChatBar/>
              <ChatDialog/>
          </div>
      </>
  );
}

export default ChatMainPage;