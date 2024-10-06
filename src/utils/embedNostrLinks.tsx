import { getMatchNostrLink } from "../Constants.tsx";
import { EmbedableContent } from "./buildContents.tsx";
import { embedJSX } from "./embedJSX.tsx";
import { safeDecode } from "./safeDecode.tsx";
import { UserLink } from "./userLink.tsx";

export function embedNostrLinks(content: EmbedableContent) {
  return embedJSX(content, {
    name: "nostr-link",
    regexp: getMatchNostrLink(),
    render: (match) => {
      const decoded = safeDecode(match[2]);
      if (!decoded) return null;

      switch (decoded.type) {
        case "npub":
          return <UserLink color="blue.500" pubkey={decoded.data} />;
        case "nprofile":
          return <UserLink color="blue.500" pubkey={decoded.data.pubkey} />;
        case "note":
        case "nevent":
        case "naddr":
        case "nrelay":
        default:
          return null;
      }
    },
  });
}
