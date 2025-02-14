"use client";

import type { UserType } from "@/types/base";
import type { ScopedMutator } from "swr";

import { Button } from "@/components/ui/button";
import UpdatePhotoModal from "./update-photo-modal";
import { useRef, useState } from "react";
import { jsonToFormData } from "@/lib/utils";
import { fetchWithToken } from "@/lib/fetch";
import API_ENDPOINTS from "@/lib/api-endpoints";
import Avatar from "@/components/shared/avatar";

interface BasicInfoCardProps {
  user: UserType | null;
  displayName: string;
  mutate: ScopedMutator;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  user,
  displayName,
  mutate,
}) => {
  const [isUpdatePhotoModalOpen, setIsUpdatePhotoModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    await handleUpdatePhoto(files);
  };

  const handleUpdatePhoto = async (files: FileList | null) => {
    setIsUpdatePhotoModalOpen(false);
    try {
      const response = await fetchWithToken({
        url: API_ENDPOINTS.USER.UPDATE,
        options: {
          method: "PUT",
          body: jsonToFormData({
            user: files
              ? {
                  avatar: files[0],
                }
              : {
                  remove_avatar: true,
                },
          }),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update user information.");
      }

      mutate(API_ENDPOINTS.USER.SHOW);
      fileInputRef.current!.value = "";
    } catch (e) {
      console.log("Unexpected error:", e);
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <div className="flex justify-between items-center rounded-lg bg-gray-100 p-4">
        <div className="flex gap-4 items-center">
          <Avatar src={user?.avatar_url} classNames={{ avatar: "w-16 h-16" }} />
          <p className="font-semibold text-lg text-text">{displayName}</p>
        </div>

        <Button
          className="bg-dark-green"
          onClick={() => setIsUpdatePhotoModalOpen(true)}
        >
          Change photo
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />

      <UpdatePhotoModal
        isOpen={isUpdatePhotoModalOpen}
        setIsOpen={setIsUpdatePhotoModalOpen}
        title="Update Avatar"
        onCancel={() => setIsUpdatePhotoModalOpen(false)}
        onUpdate={handleFileButtonClick}
        onRemove={() => handleUpdatePhoto(null)}
        avatarUploaded={!!user?.avatar_url}
      />
    </>
  );
};

export default BasicInfoCard;
