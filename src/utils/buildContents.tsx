import { NDKEvent } from "@nostr-dev-kit/ndk";
import { embedNostrLinks } from "./embedNostrLinks.tsx";

export type EmbedableContent = (string | JSX.Element)[];
export type EmbedType = {
  regexp: RegExp;
  render: (match: RegExpMatchArray, isEndOfLine: boolean) => JSX.Element | string | null;
  name: string;
  getLocation?: (match: RegExpMatchArray) => { start: number; end: number };
};

export function buildContents(event: NDKEvent) {
  let content: EmbedableContent = [event.content.trim()];

  // nostr
  content = embedNostrLinks(content);

  return content;
}
