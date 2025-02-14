"use client";

import type { ChatType, MessageType } from "@/types/base";

import { useEffect, useState } from "react";
import { fetchWithToken } from "@/lib/fetch";
import API_ENDPOINTS from "@/lib/api-endpoints";
import useSWR from "swr";
import ChatCard from "./chat-card";
import { sortChatsByDate } from "@/lib/utils";
import Spinner from "@/components/shared/spinner";
import { useDebounce } from "use-debounce";
import { useUserContext } from "@/components/auth/protected-route";
import { useChatStore } from "@/hooks/use-chat-store";

type ChatListProps = object;

const fetcher = async (url: string) => {
  const response = await fetchWithToken({
    url,
    options: {
      method: "GET",
    },
  });
  const data = await response.json();
  return data.data as ChatType[];
};

const ChatList: React.FC<ChatListProps> = () => {
  const chats = useChatStore((state) => state.chats);
  const setChats = useChatStore((state) => state.setChats);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const setSelectedContact = useChatStore((state) => state.setSelectedContact);
  const setChatMessages = useChatStore((state) => state.setChatMessages);

  const { notification, setNotification, currentUserId } = useUserContext();

  const [chatsLoading, setChatsLoading] = useState(true);

  const [tempChat, setTempChat] = useState<ChatType | null>(null);

  const [debounceChat] = useDebounce(tempChat, 500);

  useEffect(() => {
    if (!debounceChat) return;

    if (selectedChat?.id === debounceChat.id) return;

    setChatMessages([]);
    setSelectedChat(debounceChat);
    setSelectedContact(debounceChat?.contact || null);
    setTempChat(null);
  }, [
    debounceChat,
    setSelectedChat,
    setSelectedContact,
    setChatMessages,
    selectedChat,
  ]);

  useEffect(() => {
    const readMessage = async () => {
      if (!selectedChat) return;

      const chat = chats.find((chat) => chat.id === selectedChat.id);

      if (!chat?.preview_message) return;

      if (chat.preview_message.user_id === currentUserId) return;

      if (chat.read) return;

      try {
        await fetchWithToken({
          url: API_ENDPOINTS.MESSAGE.READ(selectedChat.id),
          options: {
            method: "POST",
          },
        });
      } catch (error) {
        console.log("Unexpected error:", error);
      }
    };

    readMessage();
  }, [chats, selectedChat, currentUserId]);

  const { data, error, isLoading } = useSWR(API_ENDPOINTS.CHAT.INDEX, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (data) setChats(sortChatsByDate(data));
  }, [data, setChats]);

  useEffect(() => {
    setChatsLoading(isLoading);
  }, [isLoading]);

  if (error) {
    console.log("Unexpected error:", error);
  }

  useEffect(() => {
    const handleChatNotification = async () => {
      if (!notification) return;

      if (!notification.id) {
        return setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) => {
            if (chat.id === notification.chat_id) chat.preview_message = null;

            return chat;
          });

          return sortChatsByDate(updatedChats);
        });
      }

      if (chats.some((chat) => chat.id === notification.chat_id)) {
        setChats((prevChats) => {
          const updatedChats = prevChats.map((chat) => {
            if (chat.id === notification.chat_id)
              chat.preview_message = notification as unknown as MessageType;

            return chat;
          });

          return sortChatsByDate(updatedChats);
        });
      } else {
        try {
          if (!notification.user_id) return;

          const chatResponse = await fetchWithToken({
            url: API_ENDPOINTS.CHAT.CREATE,
            options: {
              method: "POST",
              body: JSON.stringify({
                chat: {
                  participant_ids: [notification.user_id].join(","),
                  is_group_chat: false,
                },
              }),
            },
          });

          const chatData = await chatResponse.json();

          setChats((prevChats) => {
            return sortChatsByDate([chatData.data as ChatType, ...prevChats]);
          });
        } catch (error) {
          console.log("Unexpected error:", error);
        }
      }

      setNotification(null);
    };

    handleChatNotification();
  }, [notification, setChats, chats, setNotification]);

  return (
    <div className="flex flex-col select-none h-full px-2">
      {chatsLoading && (
        <div className="flex justify-center items-center w-full h-full">
          <Spinner />
        </div>
      )}
      {!chatsLoading &&
        chats?.map((chat, index) => {
          return (
            <ChatCard
              key={`${chat.id}-${index}-chat-card`}
              chat={chat}
              setTempChat={setTempChat}
            />
          );
        })}
    </div>
  );
};

export default ChatList;
