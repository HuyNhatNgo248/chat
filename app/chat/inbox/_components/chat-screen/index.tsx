"use client";

import DefaultScreen from "./default-screen";
import { useUserContext } from "@/components/auth/protected-route";
import Avatar from "@/components/shared/avatar";
import MessageInput from "./_components/message-input";
import MessageWindow from "./_components/message-window";
import { useState, useContext, createContext } from "react";
import { useChatStore } from "@/hooks/use-chat-store";
import ImageCarousel from "./_components/image-carousel";

type ChatScreenProps = object;

interface UploadProgressProps {
  uploadProgress: number | null;
  setUploadProgress: React.Dispatch<React.SetStateAction<number | null>>;
}

const UploadProgressContext = createContext<UploadProgressProps | undefined>(
  undefined
);

export const useUploadProgressContext = () => {
  const context = useContext(UploadProgressContext);
  if (!context) {
    throw new Error(
      "useUploadProgressContext must be used within a UploadProgressProvider"
    );
  }
  return context;
};

const ScreenWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <div className="max-h-screen h-full select-none">{children}</div>;
};

const ChatScreen: React.FC<ChatScreenProps> = () => {
  const selectedContact = useChatStore((state) => state.selectedContact);

  const { userStatuses } = useUserContext();

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  if (!selectedContact)
    return (
      <ScreenWrapper>
        <DefaultScreen />
      </ScreenWrapper>
    );

  return (
    <>
      <UploadProgressContext.Provider
        value={{ uploadProgress, setUploadProgress }}
      >
        <ScreenWrapper>
          {selectedContact && (
            <div className="flex flex-col h-full relative">
              <div className="w-full bg-gray-200 px-4 py-2 flex items-center">
                <div className="flex gap-2 items-center">
                  <Avatar
                    src={selectedContact.avatar_url}
                    classNames={{ avatar: "w-12 h-12" }}
                    isOnline={userStatuses[selectedContact.id]}
                  />
                  {selectedContact && (
                    <p className="font-semibold">{selectedContact.name}</p>
                  )}
                </div>
              </div>

              <MessageWindow />
              <MessageInput />
            </div>
          )}
        </ScreenWrapper>
      </UploadProgressContext.Provider>

      <ImageCarousel />
    </>
  );
};

export default ChatScreen;
