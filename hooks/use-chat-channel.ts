import type { ChatType, MessageType } from "@/types/base";
import type { ChatState } from "./use-chat-store";
import type { Consumer } from "@rails/actioncable";
import Cookies from "js-cookie";
import createCable from "@/lib/cable";
import { sortChatsByDate } from "@/lib/utils";
import { fetchWithToken } from "@/lib/fetch";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { useEffect } from "react";
import { useChatStore } from "./use-chat-store";
import { useImageCarouselStore } from "./use-image-carousel";

type ReceivedMessageType = MessageType & {
  action_type: string;
};

type MessageReadType = {
  action_type: string;
  read: boolean;
  chat_id: number;
};

type UpdateType = {
  action_type: string;
};

const ACTION = {
  CREATE: "create",
  UNSEND: "unsend",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
};

class ChatChannelManager {
  static readonly CHANNEL_NAME = "ChatChannel";

  chat: ChatType;
  token: string;
  cable: Consumer;
  setChats: ChatState["setChats"];
  setChatMessages: ChatState["setChatMessages"];
  setChannels: ChatState["setChannels"];
  setRevalidateImageCarousel: (revalidate: boolean) => void;
  currentUserId: number | null;

  constructor(
    chat: ChatType,
    currentUserId: number | null,
    setChats: ChatState["setChats"],
    setChatMessages: ChatState["setChatMessages"],
    setChannels: ChatState["setChannels"],
    setRevalidateImageCarousel: (revalidate: boolean) => void
  ) {
    this.chat = chat;
    this.token = Cookies.get("token") as string;
    this.cable = createCable(this.token);
    this.currentUserId = currentUserId;

    this.setChats = setChats;
    this.setChatMessages = setChatMessages;
    this.setChannels = setChannels;
    this.setRevalidateImageCarousel = setRevalidateImageCarousel;
  }

  handleIncomingMessage(selectedChat: ChatType | null) {
    const channel = this.createChannel(selectedChat);

    this.setChannels((prev) => ({ ...prev, [this.chat.id]: channel }));

    return () => {
      channel.unsubscribe();
    };
  }

  private createChannel(selectedChat: ChatType | null) {
    return this.cable.subscriptions.create(
      {
        channel: ChatChannelManager.CHANNEL_NAME,
        chat_id: this.chat.id,
      },
      {
        received: async (data: {
          data: ReceivedMessageType | MessageReadType | UpdateType;
        }) => {
          switch (data.data.action_type) {
            case ACTION.CREATE: {
              const message = data.data as ReceivedMessageType;
              this.revalidateImageCarousel(message);

              await this.handleCreate(message, selectedChat);

              break;
            }
            case ACTION.UNSEND: {
              const message = data.data as ReceivedMessageType;
              this.revalidateImageCarousel(message);

              await this.handleUnsend(message);
              break;
            }
            case ACTION.READ: {
              this.handleRead(data.data as MessageReadType);
              break;
            }
            case ACTION.UPDATE: {
              this.handleUpdate(data.data as ReceivedMessageType);
              break;
            }
            case ACTION.DELETE: {
              const message = data.data as ReceivedMessageType;
              this.revalidateImageCarousel(message);
              break;
            }
          }
        },
      }
    );
  }

  private revalidateImageCarousel(message: ReceivedMessageType) {
    if (message.content_type === "media/image")
      this.setRevalidateImageCarousel(true);
  }

  private async handleCreate(
    receivedMessage: ReceivedMessageType,
    selectedChat: ChatType | null
  ) {
    if (!selectedChat || receivedMessage.chat_id !== selectedChat.id) {
      return this.updateSelectedChatReadStatus(false, receivedMessage.chat_id);
    }

    this.setChatMessages((prevMessages) => {
      return [...prevMessages, receivedMessage as MessageType];
    });

    if (receivedMessage.user_id === this.currentUserId)
      return this.updateSelectedChatReadStatus(false, receivedMessage.chat_id);

    await this.readMessage(selectedChat);
  }

  private async handleUnsend(unsentMessage: ReceivedMessageType) {
    this.setChatMessages((prev) => {
      const updatedMessages = prev.filter(
        (chat) => chat.id !== unsentMessage.id
      );

      this.setChats((prev) => {
        const chatIndex = prev.findIndex(
          (chat) => chat.id === unsentMessage.chat_id
        );

        const newChats = [...prev];
        newChats[chatIndex].preview_message = updatedMessages.at(-1) || null;

        return sortChatsByDate(newChats);
      });

      return updatedMessages;
    });
  }

  private handleRead(readPayload: MessageReadType) {
    const { read, chat_id } = readPayload;

    this.updateSelectedChatReadStatus(read, chat_id);
  }

  private handleUpdate(updatedMessage: ReceivedMessageType) {
    this.setChatMessages((prev) => {
      const messageIndex = prev.findIndex(
        (message) => message.id === updatedMessage.id
      );
      const newMessages = [...prev];
      newMessages[messageIndex] = updatedMessage;

      return newMessages;
    });
  }

  private updateSelectedChatReadStatus(
    read: boolean,
    chatId: number | undefined
  ) {
    this.setChats((prev) => {
      const chatIndex = prev.findIndex((chat) => chat.id === chatId);
      const newChats = [...prev];
      newChats[chatIndex].read = read;
      return sortChatsByDate(newChats);
    });
  }

  private async readMessage(selectedChat: ChatType) {
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
  }
}

export const useChatChannel = (
  chat: ChatType,
  currentUserId: number | null
) => {
  const token = Cookies.get("token");
  const selectedChat = useChatStore((state) => state.selectedChat);
  const setChats = useChatStore((state) => state.setChats);
  const setChatMessages = useChatStore((state) => state.setChatMessages);
  const setChannels = useChatStore((state) => state.setChannels);
  const setRevalidateImageCarousel = useImageCarouselStore(
    (state) => state.setRevalidate
  );

  useEffect(() => {
    if (!token || !currentUserId) return;

    const manager = new ChatChannelManager(
      chat,
      currentUserId,
      setChats,
      setChatMessages,
      setChannels,
      setRevalidateImageCarousel
    );

    return manager.handleIncomingMessage(selectedChat);
  }, [
    chat,
    token,
    currentUserId,
    selectedChat,
    setChats,
    setChatMessages,
    setChannels,
    setRevalidateImageCarousel,
  ]);
};
