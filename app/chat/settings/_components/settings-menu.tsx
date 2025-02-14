"use client";

import { SETTINGS_ID } from "../page";
import { useSettingsContext } from "../page";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

type SettingsMenuProps = object;

const SettingsMenu: React.FC<SettingsMenuProps> = () => {
  const router = useRouter();
  const { selectedSetting, setSelectedSetting } = useSettingsContext();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/signin");
  };

  return (
    <div className="flex flex-col rounded-md overflow-hidden mx-2">
      {Object.values(SETTINGS_ID).map((setting, index) => (
        <div
          key={`setting-${setting}-${index}`}
          className={cn("bg-gray-200 px-4 py-2 cursor-pointer", {
            "bg-gray-100": selectedSetting === setting,
          })}
          onClick={() => setSelectedSetting(setting)}
        >
          <p className="capitalize text-sm">{setting}</p>
        </div>
      ))}

      <div
        className="bg-gray-200 px-4 py-2 cursor-pointer mt-8 rounded-md"
        onClick={handleLogout}
      >
        <p className="capitalize text-sm">Logout</p>
      </div>
    </div>
  );
};

export default SettingsMenu;
