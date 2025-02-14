import { create } from "zustand";
import type {
  UserType,
  ChatType,
  MessageType,
  ChatChannelType,
} from "@/types/base";

export type ChannelsType = { [chatId: number]: ChatChannelType };

export interface ChatState {
  selectedContact: UserType | null;
  setSelectedContact: (
    contact: UserType | null | ((prev: UserType | null) => UserType | null)
  ) => void;
  chats: ChatType[];
  setChats: (chats: ChatType[] | ((prev: ChatType[]) => ChatType[])) => void;
  selectedChat: ChatType | null;
  setSelectedChat: (chat: ChatType | null) => void;
  chatMessages: MessageType[];
  setChatMessages: (
    messages: MessageType[] | ((prev: MessageType[]) => MessageType[])
  ) => void;
  messagesLoading: boolean;
  setMessagesLoading: (loading: boolean) => void;
  channels: ChannelsType;
  setChannels: (
    channels: ChannelsType | ((prev: ChannelsType) => ChannelsType)
  ) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedContact: null,
  setSelectedContact: (contact) =>
    set((prevState) => ({
      selectedContact:
        typeof contact === "function"
          ? contact(prevState.selectedContact)
          : contact,
    })),
  chats: [],
  setChats: (chats) =>
    set((prevState) => ({
      chats: typeof chats === "function" ? chats(prevState.chats) : chats,
    })),
  selectedChat: null,
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  chatMessages: [],
  setChatMessages: (messages) =>
    set((prevState) => ({
      chatMessages:
        typeof messages === "function"
          ? messages(prevState.chatMessages)
          : messages,
    })),
  messagesLoading: false,
  setMessagesLoading: (loading) => set({ messagesLoading: loading }),
  channels: {},
  setChannels: (channels) =>
    set((prevState) => ({
      channels:
        typeof channels === "function"
          ? channels(prevState.channels)
          : channels,
    })),
}));
