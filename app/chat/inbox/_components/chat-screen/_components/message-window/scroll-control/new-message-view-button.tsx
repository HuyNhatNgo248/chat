"use client";

import React, { forwardRef } from "react";
import { motion } from "motion/react";
import { ArrowDownShortIcon } from "@/components/shared/icons";

interface NewMessageViewButtonProps {
  setNewMessageViewDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewMessageViewButton = forwardRef<
  HTMLDivElement,
  NewMessageViewButtonProps
>(({ setNewMessageViewDisplay }, ref) => {
  const handleClick = () => {
    if (ref && "current" in ref && ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
        behavior: "smooth",
      });
    }
    setNewMessageViewDisplay(false);
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <div className="rounded-full py-2 px-4 bg-dark-green flex justify-center items-center gap-2 text-text text-sm">
        <p className="text-text font-semibold">Unread messages</p>

        <ArrowDownShortIcon className="w-4 h-4" />
      </div>
    </motion.button>
  );
});

NewMessageViewButton.displayName = "NewMessageViewButton";

export default NewMessageViewButton;
