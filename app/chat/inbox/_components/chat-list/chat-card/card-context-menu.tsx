"use client";

import type { ChatType } from "@/types/base";

import API_ENDPOINTS from "@/lib/api-endpoints";
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { fetchWithToken } from "@/lib/fetch";
import { cn } from "@/lib/utils";
import { sortChatsByDate } from "@/lib/utils";
import ConfirmationModal from "@/components/shared/confirmation-modal";
import { useState, useEffect } from "react";
import { useChatStore } from "@/hooks/use-chat-store";

interface ContextMenuProps {
  chat: ChatType;
  isContextMenuOpen: boolean;
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

const CardContextMenu: React.FC<ContextMenuProps> = ({
  chat,
  isContextMenuOpen,
}) => {
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setChats = useChatStore((state) => state.setChats);
  const setSelectedContact = useChatStore((state) => state.setSelectedContact);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const setChatMessages = useChatStore((state) => state.setChatMessages);
  const [pointerEventsDisabled, setPointerEventsDisabled] = useState(true);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  useEffect(() => {
    if (isContextMenuOpen) {
      setPointerEventsDisabled(true);
      const timer = setTimeout(() => {
        setPointerEventsDisabled(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isContextMenuOpen]);

  const handleDeleteChat = async () => {
    try {
      await fetchWithToken({
        url: API_ENDPOINTS.CHAT.DESTROY(chat.id),
        options: {
          method: "DELETE",
        },
      });

      setChats((prev) => sortChatsByDate(prev.filter((c) => c.id !== chat.id)));
      setSelectedContact((prev) =>
        prev?.id === chat.contact.id ? null : prev
      );
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  const handleArchiveChat = async () => {
    try {
      await fetchWithToken({
        url: API_ENDPOINTS.CHAT.UPDATE(chat.id),
        options: {
          method: "PUT",
          body: JSON.stringify({ chat: { archived: true } }),
        },
      });
      setChats((prev) => sortChatsByDate(prev.filter((c) => c.id !== chat.id)));

      if (selectedChat?.id === chat.id) {
        handleHideChat();
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  const handleHideChat = () => {
    setSelectedContact(null);
    setSelectedChat(null);
    setChatMessages([]);
  };

  return (
    <>
      <ContextMenuContent
        className={cn("bg-gray-200 text-sm p-0 py-2 w-40", {
          "pointer-events-none": pointerEventsDisabled,
        })}
      >
        <div className="flex flex-col">
          <ListItemWrapper onClick={() => setIsDeleteModalOpen(true)}>
            Delete
          </ListItemWrapper>

          <ListItemWrapper onClick={() => setIsArchiveModalOpen(true)}>
            Archive
          </ListItemWrapper>

          {selectedChat?.id === chat.id && (
            <ListItemWrapper onClick={handleHideChat}>
              Hide chat
            </ListItemWrapper>
          )}
        </div>
      </ContextMenuContent>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteChat}
        title="Delete chat"
        message="Are you sure you want to delete this chat?"
      />
      <ConfirmationModal
        isOpen={isArchiveModalOpen}
        setIsOpen={setIsArchiveModalOpen}
        onCancel={() => setIsArchiveModalOpen(false)}
        onConfirm={handleArchiveChat}
        title="Archive chat"
        message="Archiving chat doesn't delete their messages."
      />
    </>
  );
};

export default CardContextMenu;
