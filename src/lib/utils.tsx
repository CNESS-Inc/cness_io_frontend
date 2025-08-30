import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const buildShareUrl = (fallback?: string) =>
  fallback || `https://dev.cness.io/directory/user-profile/${localStorage.getItem("Id")}`;

export const copyPostLink = async (url: string, onSuccess: (msg: string) => void, onError: (msg: string) => void) => {
  try {
    await navigator.clipboard.writeText(url);
    onSuccess("Post link copied to clipboard!");
  } catch {
    onError("Failed to copy link");
  }
};