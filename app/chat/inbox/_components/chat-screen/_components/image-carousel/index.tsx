"use client";

import { type CarouselApi } from "@/components/ui/carousel";
import type { ChatType, ImageType } from "@/types/base";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect, useRef } from "react";
import RetryImage from "./retry-image";
import { fetchWithToken } from "@/lib/fetch";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { useChatStore } from "@/hooks/use-chat-store";
import { useImageCarouselStore } from "@/hooks/use-image-carousel";
import { cn } from "@/lib/utils";
import useSWR, { mutate } from "swr";
import ButtonsMenu from "./buttons-menu";

const fetcher = async (selectedChat: ChatType | null) => {
  if (!selectedChat) return;

  const response = await fetchWithToken({
    url: API_ENDPOINTS.CHAT.FETCH_IMAGES(selectedChat.id),
  });

  const data = await response.json();

  if (!data.data) return [] as ImageType[];

  return data.data.sort(
    (a: ImageType, b: ImageType) => a.id - b.id,
  ) as ImageType[];
};

type ImageCarouselProps = object;

const ImageCarousel: React.FC<ImageCarouselProps> = () => {
  const selectedChat = useChatStore((state) => state.selectedChat);

  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const isOpen = useImageCarouselStore((state) => state.isOpen);
  const id = useImageCarouselStore((state) => state.id);
  const revalidate = useImageCarouselStore((state) => state.revalidate);
  const setId = useImageCarouselStore((state) => state.setId);
  const setRevalidate = useImageCarouselStore((state) => state.setRevalidate);
  const setIsOpen = useImageCarouselStore((state) => state.setIsOpen);

  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data } = useSWR(selectedChat, fetcher);

  useEffect(() => {
    if (!data) return;

    // Find the index of the image with the current id
    const index = data.findIndex((img) => img.id === id);

    if (index === -1) return;

    setActiveIndex(index);
  }, [id, data, isOpen]);

  useEffect(() => {
    if (revalidate) mutate(selectedChat);

    setRevalidate(false);
  }, [revalidate, selectedChat, setRevalidate]);

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedChat]);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const newId = data?.[api.selectedScrollSnap()].id;
      if (newId) setId(newId);
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, selectedChat, data, setId]);

  if (thumbnailRefs.current[activeIndex]) {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  useEffect(() => {
    if (!api) return;

    api.scrollTo(activeIndex, true);
  }, [activeIndex, api, selectedChat]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!api || !data) return;

      if (e.key === "ArrowRight" && api.canScrollNext()) {
        setActiveIndex(api.selectedScrollSnap() + 1);
      } else if (e.key === "ArrowLeft" && api.canScrollPrev()) {
        setActiveIndex(api.selectedScrollSnap() - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [api, selectedChat, data]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="flex flex-col justify-center items-center max-w-[70%] h-[600px] px-0 py-2 pt-4 focus:outline-none focus:ring-0 group overflow-hidden"
        classNames={{ close: "hidden" }}
      >
        <DialogHeader className="hidden">
          <DialogTitle>Image gallery</DialogTitle>
          <DialogDescription>Display images in carousel</DialogDescription>
        </DialogHeader>

        <ButtonsMenu image={data?.[activeIndex]} />

        <div className="w-full h-full grid grid-rows-[calc(100%-72px-16px),72px] gap-y-4">
          <Carousel className="h-full" setApi={setApi}>
            <CarouselContent
              className="h-full"
              classNames={{ container: "h-full" }}
            >
              {data?.map((img, index) => (
                <CarouselItem
                  key={`image-carousel-${index}`}
                  className="w-full h-full relative"
                >
                  {img.compressed && (
                    <RetryImage
                      src={img.compressed}
                      alt={`Image carousel ${index}`}
                      className="object-contain w-full h-full"
                    />
                  )}
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>

          <div className="w-full pt-2 border-t border-gray-100 overflow-x-auto flex gap-2">
            {data?.map((img, index) => (
              <div
                key={`image-thumbnail-${index}`}
                className={cn(
                  "w-12 h-12 relative cursor-pointer flex-shrink-0 opacity-50",
                  {
                    "border-2 border-text rounded-sm opacity-100":
                      activeIndex === index,
                  },
                )}
                onClick={() => {
                  setActiveIndex(index);
                }}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
              >
                {img.thumbnail && (
                  <RetryImage
                    src={img.thumbnail}
                    alt={`Image carousel thumbnail ${index}`}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarousel;
