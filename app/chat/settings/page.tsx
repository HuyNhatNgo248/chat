"use client";

import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import { createContext, useState, useContext } from "react";
import SettingsMenu from "./_components/settings-menu";
import SettingsScreen from "./_components/settings-screen";

type SettingsPageProps = object;

interface SettingsContextProps {
  selectedSetting: string;
  setSelectedSetting: React.Dispatch<React.SetStateAction<string>>;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined
);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within a ChatProvider");
  }
  return context;
};

export const SETTINGS_ID = {
  EDIT_PROFILE: "edit profile",
  SECURITY: "security",
  ABOUT_CHAT: "about chat",
};

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const [selectedSetting, setSelectedSetting] = useState(
    SETTINGS_ID.EDIT_PROFILE
  );

  return (
    <SettingsContext.Provider
      value={{
        selectedSetting,
        setSelectedSetting,
      }}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={28}
          maxSize={40}
          minSize={28}
          className="border border-gray-100"
        >
          <div className="relative flex flex-col gap-4 max-h-screen overflow-y-auto h-full">
            <div className="sticky top-0 p-4">
              <p className="text-xl font-bold text-text">Settings</p>
            </div>

            <SettingsMenu />
          </div>
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel defaultSize={72}>
          <SettingsScreen />
        </ResizablePanel>
      </ResizablePanelGroup>
    </SettingsContext.Provider>
  );
};

export default SettingsPage;
