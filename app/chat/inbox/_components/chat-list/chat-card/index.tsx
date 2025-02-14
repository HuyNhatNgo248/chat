"use client";

import type { ChatType } from "@/types/base";

import { cn, formatChatTime } from "@/lib/utils";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useState } from "react";
import Avatar from "@/components/shared/avatar";
import { useUserContext } from "@/components/auth/protected-route";
import { useChatChannel } from "@/hooks/use-chat-channel";
import { useChatStore } from "@/hooks/use-chat-store";
import CardContextMenu from "./card-context-menu";

interface ChatCardProps {
  chat: ChatType;
  setTempChat: React.Dispatch<React.SetStateAction<ChatType | null>>;
}

const ChatCard: React.FC<ChatCardProps> = ({ chat, setTempChat }) => {
  const selectedChat = useChatStore((state) => state.selectedChat);

  const { currentUserId, userStatuses } = useUserContext();
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

  useChatChannel(chat, currentUserId);

  const messageHighlight = Boolean(
    selectedChat?.id !== chat.preview_message?.chat_id &&
      !chat.read &&
      chat.preview_message &&
      chat.preview_message.user_id !== currentUserId
  );

  return (
    <ContextMenu onOpenChange={setIsContextMenuOpen} modal={false}>
      <ContextMenuTrigger>
        <div
          onClick={() => setTempChat(chat)}
          className={cn(
            "group p-4 hover:bg-gray-200 cursor-pointer rounded-md flex gap-2",
            {
              "bg-gray-100 hover:bg-gray-100":
                selectedChat?.contact.id === chat.contact.id ||
                isContextMenuOpen,
            }
          )}
        >
          <div className="relative flex flex-grow items-center gap-4">
            <Avatar
              src={chat?.contact?.avatar_url}
              classNames={{ avatar: "w-16 h-16", online: "w-4 h-4" }}
              isOnline={!!userStatuses[chat.contact.id]}
            />
            <div className="flex flex-col gap-1 w-full">
              <div className="flex justify-between">
                <p className="text-text font-semibold">{chat?.contact?.name}</p>

                {chat?.preview_message?.created_at && (
                  <p className="text-sm text-text-muted whitespace-nowrap">
                    {formatChatTime(chat.preview_message.created_at)}
                  </p>
                )}
              </div>
              {chat?.preview_message?.content && (
                <p
                  className={cn(
                    "text-sm text-text-muted break-all line-clamp-1",
                    {
                      "text-text font-semibold": messageHighlight,
                    }
                  )}
                >
                  {chat.preview_message.content}
                </p>
              )}
            </div>
          </div>

          {messageHighlight && (
            <div className="flex justify-center items-center">
              <span className="block w-3 h-3 rounded-full bg-dark-green" />
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <CardContextMenu chat={chat} isContextMenuOpen={isContextMenuOpen} />
    </ContextMenu>
  );
};

export default ChatCard;
