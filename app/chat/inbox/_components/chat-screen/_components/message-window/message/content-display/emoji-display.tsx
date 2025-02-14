import type { MessageType } from "@/types/base";

interface EmojiDisplayProps {
  message: MessageType;
}

const EmojiDisplay: React.FC<EmojiDisplayProps> = ({ message }) => {
  return <p className="text-5xl">{message.content}</p>;
};

export default EmojiDisplay;
