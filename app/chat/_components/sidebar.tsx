"use client";

import Link from "next/link";
import { ChatBubblesIcon, SettingsIcon } from "@/components/shared/icons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type SidebarProps = object;

const Sidebar: React.FC<SidebarProps> = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-between w-16 bg-gray-200 min-h-screen p-4 border-r-2 border-r-gray-100">
      <div className="flex flex-col gap-2 items-center">
        <Link
          href="/chat/inbox"
          className={cn("p-4 hover:bg-gray-100 rounded-sm", {
            "bg-gray-100": pathname === "/chat/inbox",
          })}
        >
          <ChatBubblesIcon className="w-6 h-6" />
        </Link>
        <Link
          href="/chat/settings"
          className={cn("p-4 hover:bg-gray-100 rounded-sm", {
            "bg-gray-100": pathname === "/chat/settings",
          })}
        >
          <SettingsIcon className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
