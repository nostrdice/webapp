import { Box, Button, Text, VStack } from "@chakra-ui/react";
import NDK, { NDKEvent, NDKUser } from "@nostr-dev-kit/ndk";
import { useActiveUser, useSubscribe } from "nostr-hooks";
import { useMemo, useState } from "react";
import { NOSTR_DICE_GAME_PK, RELAYS } from "../Constants.tsx";

interface ZapEventStreamProps {
  ndk: NDK;
}

export function DmEventStream({ ndk }: ZapEventStreamProps) {
  const filters = useMemo(() => [{ authors: [NOSTR_DICE_GAME_PK], kinds: [4], limit: 100 }], [NOSTR_DICE_GAME_PK]);
  const { activeUser } = useActiveUser();

  const { events } = useSubscribe({
    filters: filters,
    relays: RELAYS,
    fetchProfiles: true,
  });

  const dms = events.sort((a, b) => {
    if (!a.created_at) {
      return -1;
    }
    if (!b.created_at) {
      return 1;
    }
    return b.created_at - a.created_at;
  });

  const filteredDms = dms.filter((dm) => {
    if (!activeUser) {
      console.log(`No active user`);
      return false;
    } else {
      const receiver = findArrayWithTag(dm.tags, "p") ?? [];
      const receiverPubkey = receiver[1];
      return receiverPubkey === activeUser.pubkey;
    }
  });

  console.log(`unfiltered dms ${dms.length}`);
  console.log(`filtered dms ${filteredDms.length}`);

  return (
    <VStack spacing={4} align="stretch">
      {filteredDms.map((event, index) => (
        <Box key={index} bg="rgba(255, 255, 255, 0.3)" p={3} borderRadius="md">
          <DmCard dm={event} ndk={ndk} />
        </Box>
      ))}
    </VStack>
  );
}

interface EventCardProps {
  dm: NDKEvent;
  ndk: NDK;
}

const DmCard = ({ dm, ndk }: EventCardProps) => {
  const [decrypted, setDecrypted] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState("");

  const onDecryptClick = async () => {
    const decrypted = await ndk.signer?.decrypt(new NDKUser({ pubkey: dm.pubkey }), dm.content);
    setDecrypted(true);
    setDecryptedContent(decrypted ?? "");
  };

  return (
    <>
      {decrypted
        ? <Text color={"white"}>{decryptedContent}</Text>
        : (
          <Box display="flex" justifyContent="center" width="100%">
            <Button onClick={onDecryptClick}>🔓Decrypt</Button>
          </Box>
        )}
    </>
  );
};

function findArrayWithTag(arr: string[][], searchElement: string): string[] | undefined {
  return arr.find(innerArr => innerArr.includes(searchElement));
}
