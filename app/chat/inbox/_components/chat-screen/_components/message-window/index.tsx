"use client";

import type { MessageType } from "@/types/base";

import { useEffect, useState, useRef, Fragment } from "react";
import Message from "./message";

import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { fetchWithToken } from "@/lib/fetch";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { useUserContext } from "@/components/auth/protected-route";
import LoadingScreen from "./loading-screen";
import ProgressUpdate from "./progress-update";
import ScrollDownButton from "./scroll-control/scroll-down-button";
import { useChatStore } from "@/hooks/use-chat-store";
import Spinner from "@/components/shared/spinner";
import { parseISO, format, isToday, isThisWeek, isSameDay } from "date-fns";

const formatMessageDate = (date: Date): string => {
  if (isToday(date)) {
    return "Today";
  } else if (isThisWeek(date, { weekStartsOn: 1 })) {
    // Assuming week starts on Monday
    return format(date, "EEE h:mm a"); // e.g., "Fri 9:43 PM"
  } else {
    return format(date, "MMM d, yyyy, h:mm a"); // e.g., "Jan 20, 2025, 11:58 PM"
  }
};

type MessageWindowProps = object;

const MessageWindow: React.FC<MessageWindowProps> = () => {
  const selectedContact = useChatStore((state) => state.selectedContact);
  const chatMessages = useChatStore((state) => state.chatMessages);
  const selectedChat = useChatStore((state) => state.selectedChat);
  const chats = useChatStore((state) => state.chats);
  const messagesLoading = useChatStore((state) => state.messagesLoading);
  const setChatMessages = useChatStore((state) => state.setChatMessages);
  const setMessagesLoading = useChatStore((state) => state.setMessagesLoading);

  const [displayRead, setDisplayRead] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { currentUserId } = useUserContext();

  const [oldestMessageId, setOldestMessageId] = useState<number | null>(null);
  const [endReached, setEndReached] = useState(false);
  const [oldMessagesLoading, setOldMessagesLoading] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  const { onScroll, scrollProgress, setScrollDirection, scrollDirection } =
    useScroll(messageContainerRef);

  useEffect(() => {
    const handleFetchMessages = async () => {
      if (!selectedChat || endReached) return;

      try {
        if (oldestMessageId === null) setMessagesLoading(true);
        else setOldMessagesLoading(true);

        const response = await fetchWithToken({
          url: API_ENDPOINTS.MESSAGE.INDEX(selectedChat.id),
          params: {
            pagination: {
              before_id: oldestMessageId,
            },
          },
        });

        const data = await response.json();

        if (oldestMessageId) {
          const prevHeight = messageContainerRef.current?.scrollHeight || 0;

          setChatMessages((prev) => [...data.data, ...prev]);

          // After the state update, adjust the scroll position
          setTimeout(() => {
            if (messageContainerRef.current) {
              const newHeight = messageContainerRef.current.scrollHeight;
              const heightDifference = newHeight - prevHeight;
              messageContainerRef.current.scrollTop += heightDifference;
            }
          }, 0);
        } else {
          setChatMessages(data.data as MessageType[]);
        }

        if (oldestMessageId === null) setMessagesLoading(false);
        else setOldMessagesLoading(false);

        if (data.data.length === 0) setEndReached(true);
      } catch (error) {
        console.log("Unexpected error:", error);
      }
    };

    handleFetchMessages();
  }, [
    selectedChat,
    setMessagesLoading,
    setChatMessages,
    oldestMessageId,
    endReached,
  ]);

  useEffect(() => {
    if (!messageContainerRef.current || !chatMessages.length) return;

    if (!isChatOpen) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "auto",
      });

      setIsChatOpen(true);
    } else {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [isChatOpen, chatMessages]);

  useEffect(() => {
    if (selectedChat) {
      setIsChatOpen(false);
      setScrollDirection(null);
    }
  }, [selectedChat, setIsChatOpen, setScrollDirection]);

  // If the last chat message is not from the current user, set displayRead to false
  useEffect(() => {
    if (chatMessages?.at(-1)?.user_id !== currentUserId) {
      setDisplayRead(false);
    }
  }, [chatMessages, currentUserId]);

  // Check if the last message is read by other user and set displayRead to true
  useEffect(() => {
    const chat = chats.find((chat) => chat.id === selectedChat?.id);

    const read = Boolean(
      chat && chat.read && chat.preview_message?.user_id === currentUserId,
    );

    setDisplayRead(read);
  }, [chats, selectedChat, currentUserId]);

  useEffect(() => {
    if (!displayRead || !messageContainerRef.current) return;

    messageContainerRef.current.scrollTo({
      top: messageContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [displayRead]);

  useEffect(() => {
    if (scrollProgress === 0 && !endReached) {
      setOldestMessageId(chatMessages[0]?.id);
    }

    if (scrollProgress === 1) {
    } else if (scrollProgress > 0.7) {
      setScrollDirection(null);
    }
  }, [scrollProgress, setScrollDirection, chatMessages, endReached]);

  useEffect(() => {
    setOldestMessageId(null);
    setEndReached(false);
  }, [selectedChat]);

  if (messagesLoading) return <LoadingScreen />;

  let dateHeader: null | string = null;

  return (
    <>
      <div
        ref={messageContainerRef}
        onScroll={onScroll}
        className="overflow-y-scroll px-2 py-4 h-full"
      >
        <div className="flex flex-col h-full">
          {oldMessagesLoading && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}
          <div
            className={cn("flex flex-col gap-4 pb-4", {
              "pb-1": displayRead,
            })}
          >
            {selectedContact &&
              chatMessages.map((message, index) => {
                const messageDate = parseISO(message.created_at);

                if (
                  dateHeader === null ||
                  !isSameDay(messageDate, new Date(dateHeader))
                ) {
                  dateHeader = messageDate.toISOString();
                  return (
                    <Fragment
                      key={`${message.id}-${selectedContact.id}-${message.chat_id}-${index}`}
                    >
                      <p className="text-gray-50 text-xs text-center py-4">
                        {formatMessageDate(messageDate)}
                      </p>
                      <Message message={message} />
                    </Fragment>
                  );
                }

                return (
                  <Fragment
                    key={`${message.id}-${selectedContact.id}-${message.chat_id}-${index}`}
                  >
                    <Message message={message} />
                  </Fragment>
                );
              })}
          </div>
          {displayRead && (
            <p className="text-right pb-2 text-xs text-gray-50">Read</p>
          )}
        </div>
      </div>

      {scrollProgress < 0.85 && scrollDirection === "up" && (
        <ScrollDownButton ref={messageContainerRef} />
      )}

      <div className="flex flex-col gap-4 absolute top-[10%] transform left-1/2 -translate-x-1/2 z-10">
        <ProgressUpdate />
      </div>
    </>
  );
};

export default MessageWindow;
