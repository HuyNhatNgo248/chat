import type { MessageType } from "@/types/base";

import { cn } from "@/lib/utils";
import { ContextMenu } from "@/components/ui/context-menu";
import { useUserContext } from "@/components/auth/protected-route";
import ConentDisplay from "./content-display";
import Avatar from "@/components/shared/avatar";
import { useChatStore } from "@/hooks/use-chat-store";
import MessageContextMenu from "./message-context-menu";
import { useState } from "react";

interface MessageProps {
  message: MessageType;
}

const MessageDate: React.FC<{ date: string }> = ({ date }) => {
  return (
    <span className="text-xs text-gray-500 whitespace-nowrap hidden group-hover:block">
      {new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  );
};

const Message: React.FC<MessageProps> = ({ message }) => {
  const { currentUserId } = useUserContext();

  const selectedContact = useChatStore((state) => state.selectedContact);
  const isCurrentUser = message.user_id === currentUserId;
  const [isMessageContextMenuOpen, setIsMessageContextMenuOpen] =
    useState(false);

  return (
    <ContextMenu modal={false} onOpenChange={setIsMessageContextMenuOpen}>
      <div
        className={cn("group flex gap-4", {
          "justify-end": isCurrentUser,
          "justify-start": !isCurrentUser,
        })}
      >
        <div
          className={cn("flex flex-grow gap-2 items-end max-w-[70%]", {
            "justify-end": isCurrentUser,
            "justify-start": !isCurrentUser,
          })}
        >
          {isCurrentUser && <MessageDate date={message.updated_at} />}

          {message.user_id === selectedContact?.id && (
            <Avatar
              src={selectedContact?.avatar_url}
              classNames={{ avatar: "w-8 h-8" }}
            />
          )}

          <ConentDisplay message={message} isCurrentUser={isCurrentUser} />

          {!isCurrentUser && <MessageDate date={message.updated_at} />}
        </div>
      </div>

      <MessageContextMenu
        message={message}
        isMessageContextMenuOpen={isMessageContextMenuOpen}
      />
    </ContextMenu>
  );
};

export default Message;
