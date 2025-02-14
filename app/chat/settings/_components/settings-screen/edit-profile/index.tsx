"use client";

import type { UserType } from "@/types/base";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import { fetchWithToken } from "@/lib/fetch";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { SETTINGS_ID } from "../../../page";
import BasicInfoCard from "./basic-info-card";
import BasicInfoForm from "./basic-info-form";

type EditProfileProps = object;

const fetcher = async (url: string) => {
  const response = await fetchWithToken({
    url,
    options: {
      method: "GET",
    },
  });
  const data = await response.json();
  return data.data as UserType;
};

const EditProfile: React.FC<EditProfileProps> = () => {
  const [user, setUser] = useState<UserType | null>(null);

  const [displayName, setDisplayName] = useState("");

  const { data, error } = useSWR(API_ENDPOINTS.USER.SHOW, fetcher, {
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      setDisplayName(data.name);
    }
  }, [data]);

  if (error) {
    console.log("Unexpected error:", error);
  }

  return (
    <div className="w-full">
      <p className="text-xl font-semibold text-text capitalize mb-8">
        {SETTINGS_ID.EDIT_PROFILE}
      </p>
      <div className="flex flex-col gap-6">
        <BasicInfoCard user={user} displayName={displayName} mutate={mutate} />
        <BasicInfoForm
          user={user}
          setDisplayName={setDisplayName}
          mutate={mutate}
        />
      </div>
    </div>
  );
};

export default EditProfile;
