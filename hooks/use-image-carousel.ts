import { create } from "zustand";

export interface ImageCarouselState {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  id?: number;
  setId: (id: number) => void;
  revalidate: boolean;
  setRevalidate: (revalidate: boolean) => void;
}

export const useImageCarouselStore = create<ImageCarouselState>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  id: undefined,
  setId: (id) => set({ id }),
  revalidate: false,
  setRevalidate: (revalidate) => set({ revalidate }),
}));
