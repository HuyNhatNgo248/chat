import type { Subscription, Consumer, Mixin } from "@rails/actioncable";

export interface UserType {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
  status: string;
  avatar_url?: string;
  birthday?: string;
}

export interface ChatType {
  id: number;
  is_group_chat: boolean;
  preview_message: MessageType | null;
  contact: UserType;
  created_at: string;
  updated_at: string;
  read?: boolean;
}

export interface MessageType {
  id: number;
  user_id: number;
  chat_id: number;
  content: string;
  content_type: "text" | "media/image" | "media/audio" | "emoji";
  created_at: string;
  updated_at: string;
  media: ImageType[];
  voice_record_url: string | null;
  link_metadata: LinkMetadatumType[];
  reads: number;
}

export interface LinkMetadatumType {
  title: string;
  description: string;
  image: string;
  url: string;
  message_id: number;
}

export type ChatChannelType =
  | (Subscription<Consumer> &
      Mixin & {
        received: (data: MessageType) => void;
      })
  | null;

export interface ImageType {
  id: number;
  original_width: number;
  original_height: number;
  compressed: string;
  thumbnail: string;
  original: string;
  created_at: string;
}
