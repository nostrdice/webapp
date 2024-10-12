import {SimpleGrid, Spinner} from "@chakra-ui/react";
import { useSubscribe } from "nostr-hooks";
import { useMemo } from "react";
import { NOSTR_DICE_GAME_PK, RELAYS } from "../Constants.tsx";
import { GameCard } from "./GameCard.tsx";

export function NostrGame() {
  const filters = useMemo(() => [{ authors: [NOSTR_DICE_GAME_PK], kinds: [1] }], [NOSTR_DICE_GAME_PK]);

  const { events } = useSubscribe({
    filters: filters,
    relays: RELAYS,
    fetchProfiles: true,
  });

  if (events.length === 0) {
    return <Spinner/>;
  }

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} gap={6}>
      {events.sort((a, b) => {
        return (a.created_at && b.created_at) ? b.created_at - a.created_at : 0;
      }).map((note, index) => {
        return <GameCard note={note} key={note.id + index} gameProfile={note.author.profile} />;
      })}
    </SimpleGrid>
  );
}
