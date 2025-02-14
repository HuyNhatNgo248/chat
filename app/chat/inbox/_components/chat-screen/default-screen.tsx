import { WhatsappIcon } from "@/components/shared/icons";

type DefaultScreenProps = object;

const DefaultScreen: React.FC<DefaultScreenProps> = () => {
  return (
    <div className="w-full h-full flex justify-center items-center select-none pointer-events-none">
      <div className="flex flex-col justify-center items-center gap-4">
        <WhatsappIcon className="w-24 h-24" />
        <p className="text-lg font-bold">Select a chat to start messaging</p>
      </div>
    </div>
  );
};

export default DefaultScreen;
