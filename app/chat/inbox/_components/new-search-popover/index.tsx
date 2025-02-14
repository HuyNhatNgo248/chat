"use client";
import type { UserType, ChatType } from "@/types/base";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { NotePencilIcon } from "@/components/shared/icons";
import { useDebounce } from "use-debounce";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { fetchWithToken } from "@/lib/fetch";
import Spinner from "@/components/shared/spinner";
import UsersSearch from "./users-search";
import Contacts from "./contacts";
import { useChatStore } from "@/hooks/use-chat-store";
import { sortChatsByDate } from "@/lib/utils";

type NewSearchPopoverProps = object;

const NewSearchPopover: React.FC<NewSearchPopoverProps> = () => {
  const [nickname, setNickname] = useState("");
  const [users, setUsers] = useState<UserType[]>([]);
  const [contacts, setContacts] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const setSelectedContact = useChatStore((state) => state.setSelectedContact);
  const setChats = useChatStore((state) => state.setChats);
  const setSelectedChat = useChatStore((state) => state.setSelectedChat);
  const setChatMessages = useChatStore((state) => state.setChatMessages);
  const selectedContact = useChatStore((state) => state.selectedContact);

  const [debouncedNickname] = useDebounce(nickname, 300);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchWithToken({
          url: API_ENDPOINTS.USER.INDEX,
          options: {
            method: "GET",
          },
          params: { name: debouncedNickname },
        });

        const data = await response.json();

        setUsers(data.data as UserType[]);
      } catch (error) {
        console.log("Unexpected error:", error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedNickname]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetchWithToken({
          url: API_ENDPOINTS.CONTACT.INDEX,
          options: {
            method: "GET",
          },
        });

        const data = await response.json();

        setContacts(data.data as UserType[]);
      } catch (error) {
        console.log("Unexpected error:", error);
      }
    };

    fetchContacts();
  }, []);

  const handleCreateChat = async (user: UserType) => {
    try {
      const chatResponse = await fetchWithToken({
        url: API_ENDPOINTS.CHAT.CREATE,
        options: {
          method: "POST",
          body: JSON.stringify({
            chat: {
              participant_ids: [user.id].join(","),
              is_group_chat: false,
            },
          }),
        },
      });

      const chatData = await chatResponse.json();

      if (user.id === selectedContact?.id) return;

      setSelectedContact(user);
      setSelectedChat(chatData.data as ChatType);
      setChatMessages([]);
      setChats((prev) =>
        sortChatsByDate([
          ...prev.filter((prev) => prev.id !== chatData.data.id),
          chatData.data,
        ])
      );
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  const handleAddContact = async (user: UserType) => {
    try {
      await fetchWithToken({
        url: API_ENDPOINTS.CONTACT.CREATE,
        options: {
          method: "POST",
          body: JSON.stringify({ contact_id: user.id }),
        },
      });

      await handleCreateChat(user);

      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setContacts((prev) => [...prev, user]);
      setSelectedContact(user);
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger className="p-2 rounded-sm hover:bg-gray-100">
        <NotePencilIcon className="w-5 h-5" />
      </PopoverTrigger>
      <PopoverContent className="bg-gray-300 border border-gray-100 p-2 pt-0 w-80 max-h-[600px] overflow-y-auto relative">
        <p className="text-text text-center font-semibold mb-4 mt-2">
          New chat
        </p>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Input
              value={nickname}
              className="focus:ring-text-muted focus:border-text-muted"
              placeholder="Search by nickname"
              onChange={(e) => setNickname(e.target.value)}
            />

            {loading && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}

            {error && <p className="text-error text-sm text-center">{error}</p>}

            {!!users?.length && (
              <UsersSearch
                users={users}
                handleAddContact={handleAddContact}
                setIsPopoverOpen={setIsPopoverOpen}
              />
            )}
          </div>

          {!!contacts?.length && (
            <Contacts
              contacts={contacts}
              handleCreateChat={handleCreateChat}
              setIsPopoverOpen={setIsPopoverOpen}
            />
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NewSearchPopover;
