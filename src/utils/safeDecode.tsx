import { nip19 } from "nostr-tools";

import { safeRelayUrls } from "./safeRelayUrls.tsx";

export function safeDecode(str: string) {
  try {
    const result = nip19.decode(str);
    if ((result.type === "nevent" || result.type === "nprofile" || result.type === "naddr") && result.data.relays) {
      result.data.relays = safeRelayUrls(result.data.relays);
    }
    return result;
  } catch (e) {
    console.error(`Failed decoding nip19 ${e}`);
  }
}
