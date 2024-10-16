import { Avatar, Box, Center, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { Event, EventId, Filter, Kind, PublicKey } from "@rust-nostr/nostr-sdk";
import { decode, Section } from "light-bolt11-decoder";
import { useCallback, useEffect, useState } from "react";
import { useAsync } from "react-use";
import { NOSTR_DICE_GAME_PK } from "../Constants.tsx";
import { extractMultiplier } from "../game/ExtractMultiplier.tsx";
import { useNostrClient } from "../nostr-tools/NostrClientProvider.tsx";

export function ZapEventStream() {
  const { subscribe, unsubscribe, initialized } = useNostrClient();

  const [events, setEvents] = useState<Event[]>([]);
  const [subscribed, setSubscribed] = useState(false);

  const handleEvent = useCallback((event: Event) => {
    setEvents((prevEvents) => {
      const eventExists = prevEvents.some((prevEvent) => prevEvent.id === event.id);

      if (!eventExists) {
        return [...prevEvents, event];
      }
      return prevEvents;
    });
  }, []);

  useEffect(() => {
    const eventId = "zap-event-id";

    if (!subscribed && initialized) {
      const pubkey = PublicKey.fromHex(NOSTR_DICE_GAME_PK);
      const filter = new Filter().author(pubkey).kind(new Kind(9735));
      // TODO: use async hook here
      subscribe(eventId, filter, handleEvent).then(() => {
        setSubscribed(true);
      });
    }

    return () => {
      unsubscribe(eventId);
    };
  }, [handleEvent, initialized]);

  const zapReceipts = events.sort((a, b) => {
    return b.createdAt.asSecs() - a.createdAt.asSecs();
  });

  const loading = zapReceipts.length === 0;

  return (
    <VStack spacing={4} align="stretch">
      {loading
        ? (
          <Box bg="rgba(255, 255, 255, 0.3)" p={3} borderRadius="md">
            <Center>
              <Spinner />
            </Center>
          </Box>
        )
        : ""}

      {zapReceipts.map((event, index) => (
        <Box key={index} bg="rgba(255, 255, 255, 0.3)" p={3} borderRadius="md">
          <EventCard zapReceipt={event} />
        </Box>
      ))}
    </VStack>
  );
}

interface EventCardProps {
  zapReceipt: Event;
}

const EventCard = ({ zapReceipt }: EventCardProps) => {
  const pTag = zapReceipt.getTagContent("P");
  const zapperPubkey = pTag!;

  const eTag = zapReceipt.getTagContent("e");
  const zappedNoteId = eTag!;

  const invoiceTag = zapReceipt.getTagContent("bolt11");
  const invoice = invoiceTag!;

  const decoded = decode(invoice);
  const amount = findAmountSection(decoded.sections);

  return (
    <HStack>
      <Profile pubkey={zapperPubkey} />
      <Text>{amount?.value ? (amount?.value / 1000) : ""} {amount ? "sats" : ""}</Text>
      <Multiplier zappedNoteId={zappedNoteId} />
    </HStack>
  );
};

interface ProfileProps {
  pubkey: string;
}

function Profile({ pubkey }: ProfileProps) {
  const { lookupMetadata, initialized } = useNostrClient();

  const { value: metadata, error } = useAsync(async () => {
    if (pubkey && initialized) {
      return lookupMetadata(PublicKey.fromHex(pubkey)!);
    } else {
      return undefined;
    }
  }, [pubkey, initialized]);

  if (error) {
    console.error(`Failed fetching metadata of notes in zap stream `, error);
  }

  const elipsed = pubkey.slice(0, 4) + `...` + pubkey.slice(pubkey.length - 4, pubkey.length);

  return (
    <HStack>
      <Avatar
        size={"sm"}
        src={metadata?.getPicture()}
      />
      <Text color="white" fontSize="sm">
        <strong>{metadata?.getName() ?? elipsed}</strong>
      </Text>
    </HStack>
  );
}

function findAmountSection(sections: Section[]): { letters: string; value: number } | undefined {
  for (const section of sections) {
    switch (section.name) {
      case "amount":
        return {
          letters: section.letters,
          value: parseInt(section.value),
        };
    }
  }
  return undefined;
}

interface MultiplierProps {
  zappedNoteId: string;
}

function Multiplier({ zappedNoteId }: MultiplierProps) {
  const { lookupEvent, initialized } = useNostrClient();

  const { loading, value: zappedNote, error } = useAsync(async () => {
    if (initialized) {
      return lookupEvent(EventId.fromHex(zappedNoteId));
    } else {
      return undefined;
    }
  }, [zappedNoteId, initialized]);

  if (loading) {
    return <></>;
  }

  if (error) {
    console.log(`Failed fetching multiplier event ${error}`);
  }

  const multiplier = extractMultiplier(zappedNote?.content ?? "");

  if (multiplier) {
    return <Text color="white" fontSize="sm">{multiplier} chance</Text>;
  } else {
    return <></>;
  }
}
