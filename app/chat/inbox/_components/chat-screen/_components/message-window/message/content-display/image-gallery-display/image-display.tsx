"use client";

import type { MessageType } from "@/types/base";

import { useState } from "react";
import { calculateRatioHeight, MAX_RETRIES } from "./index";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useImageCarouselStore } from "@/hooks/use-image-carousel";

interface ImageDisplayProps {
  media: MessageType["media"][0];
  extraCount?: number;
  overlay?: boolean;
  classNames?: {
    image?: string;
    container?: string;
  };
  defaultWidth: number;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  media,
  classNames,
  defaultWidth,
  extraCount = 0,
  overlay = false,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [retryCounts, setRetryCounts] = useState<number>(0);
  const setIsOpen = useImageCarouselStore((state) => state.setIsOpen);
  const setId = useImageCarouselStore((state) => state.setId);

  const newWidth = defaultWidth;
  const newHeight = calculateRatioHeight(
    newWidth,
    media.original_width,
    media.original_height
  );

  const handleRetry = () => {
    if (retryCounts < MAX_RETRIES) {
      setRetryCounts((prev) => prev + 1);
    }
  };

  return (
    <>
      <div
        className={cn(
          "relative cursor-pointer overflow-hidden",
          classNames?.container
        )}
        onClick={() => {
          setIsOpen(true);
          setId(media.id);
        }}
      >
        <Image
          src={media.thumbnail}
          alt="Message media"
          width={newWidth}
          height={newHeight}
          className={cn(
            "object-cover transition-all duration-500 transform ease-in-out hover:scale-110",
            {
              "blur-md": !loaded,
              "blur-0": loaded,
            },
            classNames?.image
          )}
          onLoad={() => setLoaded(true)}
          onError={handleRetry}
        />
        {overlay && (
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        )}
        {overlay && extraCount > 0 && (
          <span className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold">
            +{extraCount}
          </span>
        )}
      </div>
    </>
  );
};

export default ImageDisplay;
