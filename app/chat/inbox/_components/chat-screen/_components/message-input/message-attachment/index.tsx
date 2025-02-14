"use client";

import { AddIcon } from "@/components/shared/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import FileUpload from "./file-upload";

type MessageAttachmentProps = object;

const MessageAttachment: React.FC<MessageAttachmentProps> = ({}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "rounded-full p-2 bg-gray-200 hover:bg-gray-100 transition-all duration-300",
            {
              "bg-gray-100": isPopoverOpen,
            }
          )}
        >
          <AddIcon
            className={cn(
              "w-6 h-6 transition-transform duration-300 transform",
              {
                "rotate-45": isPopoverOpen,
                "rotate-0": !isPopoverOpen,
              }
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-44 bg-gray-200 text-sm p-0 py-2">
        <div className="flex flex-col">
          <div className="py-2 px-6 cursor-pointer hover:bg-gray-100">
            <FileUpload setIsPopoverOpen={setIsPopoverOpen} />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MessageAttachment;
