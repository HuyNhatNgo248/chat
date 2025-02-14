import type { MessageType } from "@/types/base";

import TextDisplay from "./text-display";
import ImageGalleryDisplay from "./image-gallery-display";
import EmojiDisplay from "./emoji-display";
import VoiceRecordingDisplay from "./voice-recording-display";
import { cn } from "@/lib/utils";
import { ContextMenuTrigger } from "@/components/ui/context-menu";

interface ContentDisplayProps {
  message: MessageType;
  isCurrentUser: boolean;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  message,
  isCurrentUser,
}) => {
  const isText = message.content_type === "text";
  const isEmoji = message.content_type === "emoji";
  const isImage = message.content_type === "media/image";
  const isAudio = message.content_type === "media/audio";

  return (
    <ContextMenuTrigger
      className={cn(
        "relative max-w-[70%] p-3 overflow-hidden rounded-lg",
        isCurrentUser
          ? "bg-dark-green text-white rounded-br-none"
          : "bg-gray-100 text-white rounded-bl-none",
        {
          "p-0 bg-inherit rounded-lg": isImage || isAudio || isEmoji,
        }
      )}
    >
      {isText && <TextDisplay message={message} />}
      {isImage && <ImageGalleryDisplay media={message.media} />}
      {isAudio && (
        <VoiceRecordingDisplay voiceRecordUrl={message.voice_record_url} />
      )}
      {isEmoji && <EmojiDisplay message={message} />}

      {/* Tail */}
      {isText && (
        <span
          className={cn(
            "absolute bottom-0 w-0 h-0 border-[6px] border-solid",
            isCurrentUser
              ? "right-[-6px] border-l-dark-green border-t-transparent border-b-transparent border-r-transparent"
              : "left-[-6px] border-r-gray-100 border-t-transparent border-b-transparent border-l-transparent"
          )}
        />
      )}
    </ContextMenuTrigger>
  );
};

export default ContentDisplay;
