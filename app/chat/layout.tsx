import type { ChatChannelType } from "@/types/base";

import Sidebar from "./_components/sidebar";
import RefreshAfterInactivity from "./_components/refresh-after-inactivity";
import ProtectedRoute from "@/components/auth/protected-route";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export type ChannelsType = { [chatId: number]: ChatChannelType };

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute>
      <main className="flex">
        <Sidebar />
        {children}
        <RefreshAfterInactivity />
      </main>
    </ProtectedRoute>
  );
};

export default ChatLayout;
