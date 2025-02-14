"use client";

import type { UserType } from "@/types/base";
import { cn } from "@/lib/utils";
import Avatar from "@/components/shared/avatar";

interface UsersSearchProps {
  users: UserType[];
  handleAddContact: (user: UserType) => void;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UsersSearch: React.FC<UsersSearchProps> = ({
  users,
  handleAddContact,
  setIsPopoverOpen,
}) => {
  return (
    <div>
      <p className="font-bold mb-2 text-text">Search results</p>
      {users?.map((user, index) => (
        <div
          key={`${user.id}-${index}`}
          onClick={() => {
            handleAddContact(user);
            setIsPopoverOpen(false);
          }}
          className={cn(
            "bg-gray-200 border-b border-b-gray-100 p-2 cursor-pointer flex gap-2 items-center",
            {
              "rounded-t-md": index === 0,
              "rounded-b-md": index === users.length - 1,
            }
          )}
        >
          <Avatar src={user.avatar_url} classNames={{ avatar: "w-12 h-12" }} />
          <p className="text-sm">{user.name}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersSearch;
