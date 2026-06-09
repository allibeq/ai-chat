import { useConversations, useDeleteConversation, useRenameConversation } from '../hooks/useConversation'
import { useUiStore } from '../../../stores/uiStore'
import { useAuthStore } from '../../auth'
import { ConversationList } from '../components/ConversationList'
import {ErrorMessage} from "@/features/chat/components/ErrorMessage";

function ChatBar() {
    const { data: conversations, isError } = useConversations()
    const { mutate: deleteConversation } = useDeleteConversation()
    const { mutate: renameConversation } = useRenameConversation()
    const { logout } = useAuthStore()
    const { activeConversationId, setActiveConversation } = useUiStore()

    const handleLogout = () => {
        setActiveConversation(null)
        logout()
    }

    return (
        <div className="w-60 shrink-0 flex flex-col border-r border-white/10 h-full bg-black z-10 overflow-y-auto sidebar-scroll">
            <div
                onClick={() => setActiveConversation(null)}
                className={`h-5 flex items-center px-5 py-5 cursor-pointer hover:bg-white/10 transition-colors
                ${!activeConversationId ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'} text-amber-400`}
            >
                + New chat
            </div>

            {conversations && (
                <ConversationList
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelect={setActiveConversation}
                    onRename={(id, title) => renameConversation({ id, title })}
                    onDelete={deleteConversation}
                />
            )}

            {isError && (
                <ErrorMessage message="Cannot connect to server." />
            )}

            <div className="mt-auto border-t border-white/10 px-5 py-3">
                <button
                    onClick={handleLogout}
                    className="text-white/30 hover:text-white/60 text-sm cursor-pointer w-full text-left"
                >
                    Log out
                </button>
            </div>
        </div>
    )
}

export default ChatBar
