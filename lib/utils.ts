import type { ChatType, ImageType } from "@/types/base";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatChatTime(dateString: string) {
  const date = new Date(dateString);

  if (isToday(date)) {
    return format(date, "HH:mm a");
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return format(date, "MM/dd/yy");
  }
}

export function sortChatsByDate(chats: ChatType[]) {
  return chats.sort((a, b) => {
    const dateA = a.preview_message?.created_at;
    const dateB = b.preview_message?.created_at;

    if (!dateA && !dateB) return 0; // Both dates are missing, keep original order
    if (!dateA) return 1; // a is missing date, place it at the bottom
    if (!dateB) return -1; // b is missing date, place it at the bottom

    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}

export function jsonToFormData(json: Record<string, unknown>): FormData {
  const formData = new FormData();

  const appendFormData = (data: unknown, parentKey: string | null = null) => {
    if (data && typeof data === "object" && !(data instanceof Blob)) {
      if (data instanceof FileList) {
        Array.from(data).forEach((file) => {
          formData.append(`${parentKey}[]`, file);
        });
      } else {
        Object.keys(data as Record<string, unknown>).forEach((key) => {
          appendFormData(
            (data as Record<string, unknown>)[key],
            parentKey ? `${parentKey}[${key}]` : key
          );
        });
      }
    } else {
      if (parentKey) {
        if (data instanceof Blob) {
          formData.append(`${parentKey}[]`, data); // Wrap Blob in an array
        } else {
          formData.append(parentKey, data as Blob | string);
        }
      }
    }
  };

  appendFormData(json);
  return formData;
}

export async function createBlobFromUrl(
  url: string,
  retries: number = 3,
  delay: number = 300
): Promise<Blob> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Failed to fetch blob after multiple attempts");
}

export const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const downloadImage = async (image: ImageType) => {
  const blob = await createBlobFromUrl(image.original);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${generateRandomString(32)}_${image.id}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
