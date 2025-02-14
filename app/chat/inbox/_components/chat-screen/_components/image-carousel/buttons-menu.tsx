import type { ImageType } from "@/types/base";

import { DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { DownloadIcon } from "@/components/shared/icons";
import { format } from "date-fns";
import { downloadImage } from "@/lib/utils";

interface ButtonsMenuProps {
  image?: ImageType;
}

const ButtonsMenu: React.FC<ButtonsMenuProps> = ({ image }) => {
  if (!image) return null;

  return (
    <div className="hidden group-hover:block absolute w-full h-16 top-0 left-0 z-50 bg-gradient-to-b from-black to-transparent">
      <div className="flex justify-between p-4">
        <div className="flex gap-4">
          <button onClick={() => downloadImage(image)}>
            <DownloadIcon className="h-6 w-6" />
            <span className="sr-only">Download</span>
          </button>
        </div>

        <p className="text-muted text-xs">
          {format(new Date(image.created_at), "MMM d, yyyy h:mm a")}
        </p>

        <DialogClose>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </div>
    </div>
  );
};

export default ButtonsMenu;
