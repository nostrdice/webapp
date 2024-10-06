import { useProfile, useSubscribe } from "nostr-hooks";
import { NOSTR_DICE_SOCIAL_PK, RELAYS } from "../Constants.tsx";
import { SocialCard } from "./SocialCard.tsx";

const filter = [{ authors: [NOSTR_DICE_SOCIAL_PK], kinds: [1] }];

export function NostrSocial() {
  const { events } = useSubscribe({
    filters: filter,
    relays: RELAYS,
  });

  const { profile } = useProfile({ pubkey: NOSTR_DICE_SOCIAL_PK });

  return (
    <div className="grid grid-cols-1 gap-4">
      {events.sort((a, b) => {
        return (a.created_at && b.created_at) ? b.created_at - a.created_at : 0;
      }).map(note => {
        return <SocialCard note={note} key={note.id} profile={profile} />;
      })}
    </div>
  );
}
