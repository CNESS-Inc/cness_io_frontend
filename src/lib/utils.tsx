import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const buildShareUrl = (fallback?: string) =>
//   fallback || `https://dev.cness.io/directory/user-profile/${localStorage.getItem("Id")}`;

export const buildShareUrl = (postId?: string) => {
  if (postId) {
    return `${window.location.origin}/post/${postId}`;
  }
  return `${window.location.origin}/directory/user-profile/${localStorage.getItem("Id")}`;
};

export const buildProductShareUrl = (productId?: string) => {
  if (productId) {
    return `${window.location.origin}/dashboard/product-detail/${productId}`;
  }
  return `${window.location.origin}/dashboard/product-detail/${localStorage.getItem("Id")}`;
};

export const copyPostLink = async (url: string, onSuccess: (msg: string) => void, onError: (msg: string) => void) => {
  try {
    await navigator.clipboard.writeText(url);
    onSuccess("Post link copied to clipboard!");
  } catch {
    onError("Failed to copy link");
  }
};

export const copyProductLink = async (
  url: string,
  onSuccess: (msg: string) => void,
  onError: (msg: string) => void
) => {
  try {
    await navigator.clipboard.writeText(url);
    onSuccess("Product link copied to clipboard!");
  } catch {
    onError("Failed to copy link");
  }
};