import { useState, useEffect } from "react";

export const useScroll = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | null>(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [hasScrollbar, setHasScrollbar] = useState(false);

  const onScroll = () => {
    if (!ref.current) return;
    const { scrollTop, scrollHeight, clientHeight } = ref.current;
    const scrollableHeight = scrollHeight - clientHeight;

    if (scrollableHeight <= 0) return;

    const progress = scrollTop / scrollableHeight;
    const scrollPercentage = Math.min(Math.max(progress, 0), 1);
    setScrollProgress(scrollPercentage);

    if (scrollTop < lastScrollTop) {
      setScrollDirection("up");
    }

    setLastScrollTop(scrollTop);
  };

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;

    // Initialize lastScrollTop to the current scroll position
    setLastScrollTop(element.scrollTop);

    // Check if the element has a scrollbar
    setHasScrollbar(element.scrollHeight > element.clientHeight);

    element.addEventListener("scroll", onScroll);
    return () => {
      element.removeEventListener("scroll", onScroll);
    };
  }, [ref.current]);

  return {
    onScroll,
    scrollProgress,
    scrollDirection,
    hasScrollbar,
    setScrollProgress,
    setScrollDirection,
  };
};
