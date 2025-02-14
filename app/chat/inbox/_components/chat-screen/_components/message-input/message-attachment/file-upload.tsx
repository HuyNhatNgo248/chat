"use client";

import { useRef } from "react";
import { FolderIcon } from "@/components/shared/icons";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { jsonToFormData } from "@/lib/utils";
import Cookies from "js-cookie";
import { useUploadProgressContext } from "../../..";
import { useChatStore } from "@/hooks/use-chat-store";

interface FileUploadProps {
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ setIsPopoverOpen }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = Cookies.get("token");
  const { setUploadProgress } = useUploadProgressContext();

  const selectedChat = useChatStore((state) => state.selectedChat);

  const placeholderId = -Math.floor(Math.random() * 1000000);

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPopoverOpen(false);
    const files = event.target.files;

    if (!files || files.length === 0) return;

    await handleSendMessage(files);
  };

  const handleSendMessage = async (files: FileList) => {
    if (!selectedChat) return;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", API_ENDPOINTS.MESSAGE.CREATE(selectedChat.id));

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        console.log("Upload complete");
        setUploadProgress(null);
      } else {
        console.error("Upload failed");
      }
    };

    xhr.onerror = () => {
      console.error("Upload error");
    };

    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(
      jsonToFormData({
        message: {
          chat_id: selectedChat.id,
          content: "",
          files,
          placeholder_id: placeholderId,
        },
      })
    );
  };

  return (
    <>
      <div className="flex gap-3 items-center" onClick={handleFileButtonClick}>
        <FolderIcon className="w-6 h-6 text-sky-500" />
        <p>File</p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,video/*"
        multiple
      />
    </>
  );
};

export default FileUpload;
