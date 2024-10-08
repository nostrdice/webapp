import { HStack } from "@chakra-ui/react";
import { useProfile, useSubscribe } from "nostr-hooks";
import { useMemo } from "react";
import { NOSTR_DICE_SOCIAL_PK, RELAYS } from "../Constants.tsx";
import { SocialCard } from "./SocialCard.tsx";

export interface NostrSocialProps {
  since: number;
}

export function NostrSocial({ since }: NostrSocialProps) {
  const filters = useMemo(() => [{ authors: [NOSTR_DICE_SOCIAL_PK], kinds: [1], limit: 10, since }], [since]);

  const { events } = useSubscribe({
    filters: filters,
    relays: RELAYS,
  });

  const { profile } = useProfile({ pubkey: NOSTR_DICE_SOCIAL_PK });

  return (
    <HStack
      spacing={4}
      align="flex-start"
    >
      {events.sort((a, b) => {
        return (a.created_at && b.created_at) ? b.created_at - a.created_at : 0;
      }).map(note => {
        return <SocialCard note={note} key={note.id} profile={profile} />;
      })}
    </HStack>
  );
}
