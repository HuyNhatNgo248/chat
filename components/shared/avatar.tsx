import { cn } from "@/lib/utils";
import { PersonCircleIcon } from "./icons";
import Image from "next/image";

interface AvatarProps {
  classNames?: {
    avatar?: string;
    online?: string;
  };
  src?: string;
  isOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ classNames, src, isOnline }) => {
  return src ? (
    <div className={cn("w-6 h-6 relative flex-shrink-0", classNames?.avatar)}>
      <Image
        src={src}
        alt="Avatar"
        width={500}
        height={500}
        className="w-full h-full object-cover rounded-full"
        priority
      />

      {!!isOnline && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-gray-300",
            classNames?.online
          )}
        />
      )}
    </div>
  ) : (
    <div className="rounded-full overflow-hidden flex-shrink-0">
      <PersonCircleIcon
        className={cn("w-6 h-6 bg-gray-100", classNames?.avatar)}
      />
    </div>
  );
};

export default Avatar;
