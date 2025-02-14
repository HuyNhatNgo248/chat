"use client";

import type { MessageType } from "@/types/base";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TextDisplayProps {
  message: MessageType;
}

const MAX_RETRIES = 3;

const TextDisplay: React.FC<TextDisplayProps> = ({ message }) => {
  const [loaded, setLoaded] = useState(false);
  const [retryCounts, setRetryCounts] = useState<number[]>(
    message.link_metadata.map(() => 0)
  );

  const contentWithLinks = message.content
    .split(/(https?:\/\/[^\s/$.?#].[^\s]*)/gi)
    .map((part, index) => {
      if (part.match(/https?:\/\/[^\s/$.?#].[^\s]*/gi)) {
        return (
          <Link
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-sky-200"
          >
            {part}
          </Link>
        );
      }
      return part;
    });

  const handleRetry = (index: number) => {
    setRetryCounts((prev) => {
      const newRetryCounts = [...prev];
      newRetryCounts[index] += 1;
      return newRetryCounts;
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm break-all whitespace-pre-wrap">
        {contentWithLinks}
      </p>

      {message.link_metadata.length > 0 && (
        <div className="flex flex-col gap-4">
          {message.link_metadata.map((metadata, index) => {
            const retryCount = retryCounts[index];
            const shouldRetry = retryCount < MAX_RETRIES;
            return (
              <TooltipProvider
                key={`${metadata.url}-${index}-metadata-metadata`}
              >
                <Tooltip>
                  <TooltipTrigger>
                    <Link href={metadata.url} target="_blank">
                      <div className="flex gap-2 border-l border-l-dark-green pl-2">
                        <div className="flex flex-col gap-1 justify-start">
                          <p className="text-sm text-text line-clamp-1 text-left">
                            {metadata.title}
                          </p>
                          <p className="text-xs text-text-muted line-clamp-2 text-left">
                            {metadata.description}
                          </p>
                        </div>

                        <Image
                          width={112}
                          height={112}
                          src={metadata.image}
                          alt="Message Link Preview"
                          className={cn(
                            "rounded-sm w-16 h-16 object-cover transition-all duration-500",
                            {
                              "blur-0": loaded,
                              "blur-sm": !loaded,
                            }
                          )}
                          onLoad={() => setLoaded(true)}
                          onError={() => {
                            if (shouldRetry) {
                              handleRetry(index);
                            }
                          }}
                          key={`${metadata.description}-${retryCount}`}
                        />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className="w-72 bg-gray-300">
                    <p className="line-clamp-5">{metadata.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TextDisplay;
