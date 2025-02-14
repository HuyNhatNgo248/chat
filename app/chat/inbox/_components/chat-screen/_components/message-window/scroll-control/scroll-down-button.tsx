"use client";

import { forwardRef } from "react";
import { ArrowDownIcon } from "@/components/shared/icons";
import { motion } from "motion/react";

type ScrollDownButtonProps = object;

const ScrollDownButton = forwardRef<HTMLDivElement, ScrollDownButtonProps>(
  ({}, ref) => {
    const handleClick = () => {
      if (ref && "current" in ref && ref.current) {
        ref.current.scrollTo({
          top: ref.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    return (
      <motion.button
        className={"absolute bottom-[10%] right-5 z-10"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
      >
        <div
          className={
            "rounded-full p-2 bg-gray-50 flex justify-center items-center"
          }
        >
          <ArrowDownIcon className="w-6 h-6 text-text" />
        </div>
      </motion.button>
    );
  },
);

ScrollDownButton.displayName = "ScrollDownButton";

export default ScrollDownButton;
