import { safeRelayUrl } from "./safeRelayUrl.tsx";

export function safeRelayUrls(urls: Iterable<string>): string[] {
  return Array.from(urls).map(safeRelayUrl).filter(Boolean) as string[];
}
