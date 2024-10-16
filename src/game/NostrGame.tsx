import { SimpleGrid, Spinner } from "@chakra-ui/react";
import { Duration, EventSource, Filter, Kind, PublicKey } from "@rust-nostr/nostr-sdk";
import { useAsync } from "react-use";
import { NOSTR_DICE_GAME_PK } from "../Constants.tsx";
import { useNostrClient } from "../nostr-tools/NostrClientProvider.tsx";
import { GameCard } from "./GameCard.tsx";

export function NostrGame() {
  const { client, initialized } = useNostrClient();

  const { loading, value: events, error } = useAsync(async () => {
    if (initialized) {
      const pubkey = PublicKey.fromHex(NOSTR_DICE_GAME_PK);
      const filter = new Filter().author(pubkey).kind(new Kind(1));
      const source = EventSource.relays(Duration.fromSecs(10));
      const events = await client!.getEventsOf([filter], source);
      if (events.length > 0) {
        return events;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }, [client, initialized]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    console.error(`Failed fetching game notes `, error);
  }

  return (
    <SimpleGrid columns={{ sm: 1, md: 2, xl: 3 }} gap={6}>
      {events && events.sort((a, b) => {
        return (a.createdAt && b.createdAt) ? b.createdAt.asSecs() - a.createdAt.asSecs() : 0;
      }).map((note, index) => {
        return <GameCard note={note} key={note.id.toHex() + index} />;
      })}
    </SimpleGrid>
  );
}
