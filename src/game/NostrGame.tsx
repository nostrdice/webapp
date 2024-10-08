import { SimpleGrid } from "@chakra-ui/react";
import { useSubscribe } from "nostr-hooks";
import { NOSTR_DICE_GAME_PK, RELAYS } from "../Constants.tsx";
import { GameCard } from "./GameCard.tsx";

const filter = [{ authors: [NOSTR_DICE_GAME_PK], kinds: [1] }];

export function NostrGame() {
  const { events } = useSubscribe({
    filters: filter,
    relays: RELAYS,
  });

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} gap={6}>
      {events.sort((a, b) => {
        return (a.created_at && b.created_at) ? b.created_at - a.created_at : 0;
      }).map(note => {
        return <GameCard note={note} key={note.id} />;
      })}
    </SimpleGrid>
  );
}
