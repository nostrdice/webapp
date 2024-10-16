import { Box, Button, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { Event, Filter, Kind, NostrSigner, PublicKey } from "@rust-nostr/nostr-sdk";
import { useCallback, useEffect, useState } from "react";
import { useAsync } from "react-use";
import { NOSTR_DICE_GAME_PK } from "../Constants.tsx";
import { useNostrClient } from "../nostr-tools/NostrClientProvider.tsx";

export function DmEventStream() {
  const { client, subscribe, unsubscribe, initialized } = useNostrClient();

  const [events, setEvents] = useState<Event[]>([]);
  const [subscribed, setSubscribed] = useState(false);

  const { value: nostrSigner, error } = useAsync(async () => {
    return client?.signer();
  }, [client]);

  const { value: activeUser, error: activeUserError } = useAsync(async () => {
    return nostrSigner?.publicKey();
  }, [nostrSigner]);

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
    const eventId = "dm-event-id";

    if (!subscribed && activeUser && initialized) {
      const pubkey = PublicKey.fromHex(NOSTR_DICE_GAME_PK);
      const filter = new Filter().pubkey(activeUser).author(pubkey).kind(new Kind(4)).limit(20);
      subscribe(eventId, filter, handleEvent).then(() => {
        setSubscribed(true);
      });
    }

    return () => {
      unsubscribe(eventId);
    };
  }, [activeUser, handleEvent, initialized]);

  const eventsSorted = events.sort((a, b) => {
    return b.createdAt.asSecs() - a.createdAt.asSecs();
  });

  if (error) {
    console.error(`Failed getting nostr signer `, error);
  }
  if (activeUserError) {
    console.error(`Failed fetching active user `, error);
  }

  const eventsLoading = eventsSorted.length === 0;

  return (
    <VStack spacing={4} align="stretch">
      {eventsLoading
        ? (
          <Box bg="rgba(255, 255, 255, 0.3)" p={3} borderRadius="md">
            <Center>
              <Spinner />
            </Center>
          </Box>
        )
        : ""}
      {eventsSorted.map((event, index) => (
        <Box key={index} bg="rgba(255, 255, 255, 0.3)" p={3} borderRadius="md">
          {nostrSigner
            && <DmCard dm={event} nostrSigner={nostrSigner!} />}
        </Box>
      ))}
    </VStack>
  );
}

interface EventCardProps {
  dm: Event;
  nostrSigner: NostrSigner;
}

const DmCard = ({ dm, nostrSigner }: EventCardProps) => {
  const [decrypted, setDecrypted] = useState(false);
  const [decryptedContent, setDecryptedContent] = useState("");

  const onDecryptClick = async () => {
    try {
      const decrypted = await nostrSigner.nip04Decrypt(dm.author, dm.content);
      setDecrypted(true);
      setDecryptedContent(decrypted ?? "");
    } catch (error) {
      console.error(`Failed decrypting ${error}`);
    }
  };

  return (
    <>
      {decrypted
        ? (
          <VStack>
            <Text color={"white"}>
              {dm.createdAt.toHumanDatetime()}
            </Text>
            <Text color={"white"}>
              {decryptedContent}
            </Text>
          </VStack>
        )
        : (
          <Box display="flex" justifyContent="center" width="100%">
            <VStack>
              <Text color={"white"}>
                {dm.createdAt.toHumanDatetime()}
              </Text>
              <Button onClick={onDecryptClick}>🔓Decrypt</Button>
            </VStack>
          </Box>
        )}
    </>
  );
};
