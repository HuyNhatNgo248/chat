"use client";

import type { MessageType } from "@/types/base";
import { fetchWithToken } from "@/lib/fetch";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { useChatStore } from "@/hooks/use-chat-store";
import { cn, downloadImage } from "@/lib/utils";
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import ConfirmationModal from "@/components/shared/confirmation-modal";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface MessageContextMenuProps {
  message: MessageType;
  isMessageContextMenuOpen: boolean;
}

const ListItemWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}> = ({ children, className, onClick }) => {
  return (
    <ContextMenuItem
      className={cn("py-2 px-6 cursor-pointer hover:bg-gray-100", className)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </ContextMenuItem>
  );
};

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  message,
  isMessageContextMenuOpen,
}) => {
  const isCurrentUser = message.user_id === Number(Cookies.get("userId"));
  const setChatMessages = useChatStore((state) => state.setChatMessages);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const channels = useChatStore((state) => state.channels);
  const [isUnsendModalOpen, setIsUnsendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pointerEventsDisabled, setPointerEventsDisabled] = useState(true);

  useEffect(() => {
    if (isMessageContextMenuOpen) {
      setPointerEventsDisabled(true);
      const timer = setTimeout(() => {
        setPointerEventsDisabled(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMessageContextMenuOpen]);

  const handleCopyMessage = () => {
    navigator.clipboard
      .writeText(message.content)
      .then(() => {
        console.log("Message copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy message: ", err);
      });
  };

  const handleDeleteMessage = async () => {
    try {
      const response = await fetchWithToken({
        url: API_ENDPOINTS.MESSAGE.DESTROY(message.chat_id, message.id),
        options: {
          method: "DELETE",
        },
      });

      const data = await response.json();

      setChatMessages((prev) => {
        const updatedMessages = prev.filter(
          (chat) => chat.id !== (data.data as MessageType).id
        );

        return updatedMessages;
      });
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  const handleUnsendMessage = async () => {
    if (!selectedChat) return;

    channels[selectedChat.id]?.perform("unsend_message", {
      message: {
        id: message.id,
      },
    });
  };

  const handleSaveAs = async () => {
    if (message.content_type !== "media/image") return;

    await Promise.all(message.media.map((image) => downloadImage(image)));
  };

  return (
    <>
      <ContextMenuContent
        alignOffset={10}
        className={cn("bg-gray-200 text-sm p-0 py-2 w-40", {
          "pointer-events-none": pointerEventsDisabled,
        })}
      >
        <div className="flex flex-col">
          {message.content_type !== "media/image" && (
            <ListItemWrapper onClick={handleCopyMessage}>Copy</ListItemWrapper>
          )}

          <ListItemWrapper
            onClick={() => {
              setIsDeleteModalOpen(true);
            }}
          >
            Delete
          </ListItemWrapper>
          {isCurrentUser && (
            <ListItemWrapper
              onClick={() => {
                setIsUnsendModalOpen(true);
              }}
            >
              Unsend
            </ListItemWrapper>
          )}

          {message.content_type === "media/image" && (
            <ListItemWrapper onClick={handleSaveAs}>Save as</ListItemWrapper>
          )}
        </div>
      </ContextMenuContent>

      <ConfirmationModal
        isOpen={isUnsendModalOpen}
        setIsOpen={setIsUnsendModalOpen}
        title="Unsend Message"
        message="The selected message will be removed from the chat for all participants."
        onCancel={() => setIsUnsendModalOpen(false)}
        onConfirm={handleUnsendMessage}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Delete Message"
        message="The selected message will be deleted from your device only. They won't be deleted from your friends' devices."
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMessage}
      />
    </>
  );
};

export default MessageContextMenu;
