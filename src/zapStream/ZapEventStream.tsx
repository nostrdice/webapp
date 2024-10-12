import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";
import NDK, { NDKEvent } from "@nostr-dev-kit/ndk";
import { decode, Section } from "light-bolt11-decoder";
import { useProfile, useSubscribe } from "nostr-hooks";
import { useMemo } from "react";
import { useAsync } from "react-use";
import { NOSTR_DICE_GAME_PK, RELAYS } from "../Constants.tsx";
import { extractMultiplier } from "../game/ExtractMultiplier.tsx";

interface ZapEventStreamProps {
  ndk: NDK;
}

export function ZapEventStream({ ndk }: ZapEventStreamProps) {
  const filters = useMemo(() => [{ authors: [NOSTR_DICE_GAME_PK], kinds: [9735], limit: 100 }], [NOSTR_DICE_GAME_PK]);

  const { events } = useSubscribe({
    filters: filters,
    relays: RELAYS,
    fetchProfiles: true,
  });

  const zapReceipts = events.sort((a, b) => {
    if (!a.created_at) {
      return -1;
    }
    if (!b.created_at) {
      return 1;
    }
    return b.created_at - a.created_at;
  });

  return (
    <VStack spacing={4} align="stretch">
      {zapReceipts.map((event, index) => (
        <Box key={index} bg="rgba(255, 255, 255, 0.3)" p={3} borderRadius="md">
          <EventCard zapReceipt={event} ndk={ndk} />
        </Box>
      ))}
    </VStack>
  );
}

interface MultiplierProps {
  zappedNoteId: string;
  ndk: NDK;
}

function Multiplier({ zappedNoteId, ndk }: MultiplierProps) {
  const { loading, value: zappedNote, error } = useAsync(async () => {
    return await ndk.fetchEvent(zappedNoteId);
  }, [zappedNoteId]);

  if (loading) {
    return <></>;
  }

  if (error) {
    console.log(`Failed fetching event ${error}`);
  }

  const multiplier = extractMultiplier(zappedNote?.content ?? "");

  if (multiplier) {
    return <Text color="white" fontSize="sm">{multiplier} chance</Text>;
  } else {
    return <></>;
  }
}

interface EventCardProps {
  zapReceipt: NDKEvent;
  ndk: NDK;
}

const EventCard = ({ zapReceipt, ndk }: EventCardProps) => {
  const pTag = findArrayWithTag(zapReceipt.tags, "P") ?? [];
  const zapperPubkey = pTag[1];

  const eTag = findArrayWithTag(zapReceipt.tags, "e") ?? [];
  const zappedNoteId = eTag[1];

  const invoiceTag = findArrayWithTag(zapReceipt.tags, "bolt11") ?? [];
  const invoice = invoiceTag[1];

  const decoded = decode(invoice);
  const amount = findAmountSection(decoded.sections);

  return (
    <HStack>
      <Profile pubkey={zapperPubkey} />
      <Text>{amount?.value ? (amount?.value / 1000) : ""} {amount ? "sats" : ""}</Text>
      <Multiplier zappedNoteId={zappedNoteId} ndk={ndk} />
    </HStack>
  );
};

interface ProfileProps {
  pubkey: string;
}

function Profile({ pubkey }: ProfileProps) {
  const pk = useMemo(() => pubkey, [pubkey]);
  const { profile } = useProfile({ pubkey: pk });

  const elipsed = pk.slice(0, 4) + `...` + pk.slice(pk.length - 4, pk.length);

  return (
    <HStack>
      <Avatar
        size={"sm"}
        src={profile?.image}
      />
      <Text color="white" fontSize="sm">
        <strong>{profile?.name ?? elipsed}</strong>
      </Text>
    </HStack>
  );
}

function findArrayWithTag(arr: string[][], searchElement: string): string[] | undefined {
  return arr.find(innerArr => innerArr.includes(searchElement));
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
