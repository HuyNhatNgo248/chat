import { useSettingsContext, SETTINGS_ID } from "../../page";
import EditProfile from "./edit-profile";
import AboutChat from "./about-chat";
import Security from "./security";

type SettingsScreenProps = object;

const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { selectedSetting } = useSettingsContext();

  return (
    <div className="flex justify-center my-12 max-h-screen overflow-y-auto">
      <div className="w-8/12">
        {selectedSetting === SETTINGS_ID.EDIT_PROFILE && <EditProfile />}
        {selectedSetting === SETTINGS_ID.SECURITY && <Security />}
        {selectedSetting === SETTINGS_ID.ABOUT_CHAT && <AboutChat />}
      </div>
    </div>
  );
};

export default SettingsScreen;
