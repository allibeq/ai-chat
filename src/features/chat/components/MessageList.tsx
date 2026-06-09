import { Virtuoso } from 'react-virtuoso'
import MessageItem from './MessageItem'
import type { MessageData } from '../../../lib/schemas/dialogSchema'

type Props = {
    messages: MessageData[]
}

function MessageList({ messages }: Props) {
    return (
            <Virtuoso
                style={{ height: '100%' }}
                data={messages}
                followOutput="smooth"
                initialTopMostItemIndex={messages.length - 1}
                computeItemKey={(_, msg) => msg.id}
                itemContent={(_, msg) => (
                    <div className="px-4">
                        <MessageItem msg={msg} />
                    </div>
                )}
                components={{
                    Header: () => <div className="h-6" />,
                    Footer: () => <div className="h-6" />,
                }}
            />
    )
}

export default MessageList