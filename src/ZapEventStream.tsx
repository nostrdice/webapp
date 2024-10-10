import { Avatar, Box, HStack, Text, VStack } from "@chakra-ui/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useNdk, useProfile, useSubscribe } from "nostr-hooks";
import { useMemo } from "react";
import { useAsync } from "react-use";
import { NOSTR_DICE_GAME_PK, RELAYS } from "./Constants.tsx";
import { extractMultiplier } from "./game/ExtractMultiplier.tsx";

export function ZapEventStream() {
  const filters = useMemo(() => [{ authors: [NOSTR_DICE_GAME_PK], kinds: [9735], limit: 100 }], []);

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

  console.log(`Found ${zapReceipts.length}`);

  return (
    <VStack spacing={4} align="stretch">
      {zapReceipts.map((event, index) => (
        <Box key={index} bg="rgba(255, 255, 255, 0.3)" p={3} borderRadius="md">
          <EventCard zapReceipt={event} />
        </Box>
      ))}
    </VStack>
  );
}

interface EventCardProps {
  zapReceipt: NDKEvent;
}

interface MultiplierProps {
  zappedNoteId: string;
}

function Multiplier({ zappedNoteId }: MultiplierProps) {
  const { ndk } = useNdk();
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

const EventCard = ({ zapReceipt }: EventCardProps) => {
  const pTag = findArrayWithTag(zapReceipt.tags, "P") ?? [];
  const zapper = pTag[1];

  const eTag = findArrayWithTag(zapReceipt.tags, "e") ?? [];
  const zappedNoteId = eTag[1];

  return (
    <HStack>
      <Profile pubkey={zapper} /> <Multiplier zappedNoteId={zappedNoteId} />
    </HStack>
  );
};

interface ProfileProps {
  pubkey: string;
}

function Profile({ pubkey }: ProfileProps) {
  const { profile } = useProfile({ pubkey: pubkey });
  return (
    <HStack>
      <Avatar
        size={"sm"}
        src={profile?.image}
      />
      <Text color="white" fontSize="sm">
        <strong>{profile?.displayName}</strong>
      </Text>
    </HStack>
  );
}

function findArrayWithTag(arr: string[][], searchElement: string): string[] | undefined {
  return arr.find(innerArr => innerArr.includes(searchElement));
}
