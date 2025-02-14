"use client";

import type { MessageType } from "@/types/base";
import ImageDisplay from "./image-display";

interface ImageGalleryDisplayProps {
  media: MessageType["media"];
}

export const calculateRatioHeight = (
  width: number,
  originalWidth: number,
  originalHeight: number,
) => {
  return (width / originalWidth) * originalHeight;
};

export const MAX_RETRIES = 3;

const ImageGalleryDisplay: React.FC<ImageGalleryDisplayProps> = ({ media }) => {
  const mediaLength = media?.length;

  if (!mediaLength) return null;

  if (mediaLength === 1) {
    return (
      <ImageDisplay
        media={media[0]}
        defaultWidth={400}
        classNames={{
          container: "w-[360px] h-auto",
          image: "rounded-lg",
        }}
      />
    );
  }

  if (mediaLength === 3) {
    return (
      <div className="grid grid-cols-2 rounded-lg overflow-hidden">
        {media.map((data, index) => {
          const isLast = index === 2;

          return (
            <ImageDisplay
              key={`${data.thumbnail}-${index}`}
              media={data}
              defaultWidth={200}
              classNames={{
                image: isLast
                  ? "w-full aspect-square"
                  : "w-[180px] aspect-square",
                container: isLast ? "col-span-2" : "",
              }}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 rounded-lg overflow-hidden">
      {media.slice(0, 4).map((data, index) => {
        const extraCount = mediaLength - 4;

        return (
          <ImageDisplay
            key={`${data.thumbnail}-${index}`}
            media={data}
            defaultWidth={200}
            extraCount={extraCount}
            classNames={{
              image: "w-[180px] aspect-square",
            }}
            overlay={index === 3 && extraCount > 0}
          />
        );
      })}
    </div>
  );
};

export default ImageGalleryDisplay;
