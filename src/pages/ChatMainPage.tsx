import ChatBar from "@/features/chat/conv-bar/ChatBar";
import ChatDialog from "@/features/chat/dialog/ChatDialog";

function ChatMainPage() {

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