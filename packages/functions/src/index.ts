import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findById<T extends { id: number | string }>(
  items: T[],
  id: T["id"]
): T | undefined {
  return items.find((item) => item.id === id)
}
