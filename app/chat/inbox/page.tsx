"use client";

import NewSearchPopover from "./_components/new-search-popover";
import ChatScreen from "./_components/chat-screen";
import ChatList from "./_components/chat-list";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";

type InboxPageProps = object;

const InboxPage: React.FC<InboxPageProps> = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={28}
        maxSize={40}
        minSize={28}
        className="border border-r-gray-100"
      >
        <div className="relative flex flex-col gap-4 max-h-screen overflow-y-auto h-full">
          <div className="sticky top-0 z-10 bg-gray-300 flex justify-between items-center p-4">
            <p className="text-xl font-bold text-text">Chats</p>
            <NewSearchPopover />
          </div>

          <ChatList />
        </div>
      </ResizablePanel>
      <ResizableHandle />

      <ResizablePanel defaultSize={72} className="border-l-gray-100">
        <ChatScreen />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default InboxPage;
