"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { fetchWithToken } from "@/lib/fetch";
import { MicIcon, SendIcon } from "@/components/shared/icons";
import { cn } from "@/lib/utils";
import VoiceRecorder from "./voice-recorder";
import MessageAttachment from "./message-attachment";
import { useChatStore } from "@/hooks/use-chat-store";

type MessageInputProps = object;

const MessageInput: React.FC<MessageInputProps> = () => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedChat = useChatStore((state) => state.selectedChat);
  const messagesLoading = useChatStore((state) => state.messagesLoading);

  const handleSendMessage = async () => {
    if (!selectedChat || !message.trim()) return;

    try {
      await fetchWithToken({
        url: API_ENDPOINTS.MESSAGE.CREATE(selectedChat.id),
        options: {
          method: "POST",
          body: JSON.stringify({
            message: {
              chat_id: selectedChat.id,
              content: message,
            },
          }),
        },
      });
      setMessage(""); // Clear the message after sending
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      if (message.trim()) {
        handleSendMessage();
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  useEffect(() => {
    setMessage("");
    setIsRecording(false);
  }, [selectedChat]);

  useEffect(() => {
    if (messagesLoading) return;

    if (textareaRef.current) textareaRef.current.focus();
  }, [messagesLoading]);

  return (
    <>
      <div
        className={cn("bg-gray-200 px-4 py-2 hidden", {
          block: isRecording,
        })}
      >
        <VoiceRecorder
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </div>

      <div
        className={cn("flex items-center gap-2 bg-gray-200 px-4 py-2", {
          hidden: isRecording,
        })}
      >
        <MessageAttachment />

        <Textarea
          ref={textareaRef}
          value={message}
          rows={1}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          disabled={messagesLoading}
          className="flex-grow resize-none overflow-hidden min-h-8 max-h-40 focus:ring-gray-100 focus:border-gray-100 ring-gray-100 border-gray-100"
        />

        <div className="relative w-10 h-10">
          <button
            className={cn(
              "absolute inset-0 transition-all duration-200 flex justify-center items-center",
              message.trim().length === 0 ? "opacity-100 z-10" : "opacity-0"
            )}
            onClick={() => setIsRecording(!isRecording)}
            disabled={message.trim().length > 0 || messagesLoading}
          >
            <div className="p-2 hover:bg-gray-100 rounded-full">
              <MicIcon className="w-6 h-6" />
            </div>
          </button>
          <button
            className={cn(
              "flex justify-center items-center absolute inset-0 transition-all duration-200",
              message.trim().length > 0 ? "opacity-100 z-10" : "opacity-0"
            )}
            onClick={handleSendMessage}
            disabled={message.trim().length === 0 || messagesLoading}
          >
            <div className="p-2 bg-dark-green rounded-full">
              <SendIcon className="w-4 h-4 text-gray-300" />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default MessageInput;
