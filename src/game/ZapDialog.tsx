import {
  Avatar,
  Box,
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Event, PublicKey, ZapDetails, ZapEntity, ZapType } from "@rust-nostr/nostr-sdk";
import { X } from "lucide-react";
import React, { useState } from "react";
import { useAsync } from "react-use";
import { useNostrClient } from "../nostr-tools/NostrClientProvider.tsx";

interface ZapEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameProfilePubkey?: PublicKey | undefined;
  event: Event;
  multiplier: string;
}

const ZapEventModal = ({ isOpen, onClose, gameProfilePubkey, event, multiplier }: ZapEventModalProps) => {
  const [amount, setAmount] = useState(21);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { client, lookupMetadata, initialized } = useNostrClient();

  function onAmountChange(amount: number) {
    setAmount(amount);
  }

  function onAmountInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const amount = parseInt(e.target.value, 10);
    setAmount(amount);
  }

  const { value: metadata, error } = useAsync(async () => {
    if (gameProfilePubkey && initialized) {
      return lookupMetadata(gameProfilePubkey!);
    } else {
      return undefined;
    }
  }, [gameProfilePubkey, initialized]);

  if (error) {
    console.error(`Failed fetching metadata of notes in dialog `, error);
  }

  const onZapClick = async () => {
    if (initialized) {
      setIsLoading(true);
      const zapEntity = ZapEntity.event(event.id);
      const zapDetails = new ZapDetails(ZapType.Public).message(comment);
      try {
        await client?.zap(zapEntity, amount, zapDetails);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        onClose();
      }
    } else {
      console.error(`Can't zap if client is not initialized`);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader display="flex" justifyContent="space-between" alignItems="center">
          <ModalCloseButton as={X} />
        </ModalHeader>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack>
              <VStack align="start" spacing={0}>
                <Text fontWeight="normal">
                  Zap this event to have a chance of winning <strong>{multiplier}</strong> your zap amount
                </Text>
              </VStack>
            </HStack>

            <Box bg="gray.100" p={3} borderRadius="md">
              <HStack>
                <Avatar
                  size={"sm"}
                  src={metadata?.getPicture()}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{metadata?.getDisplayName()}</Text>
                  <Text fontSize="sm" color="gray.500">{metadata?.getLud16()}</Text>
                </VStack>
              </HStack>

              <Text mt={2}>
                {event?.content}
              </Text>
            </Box>

            <Input
              placeholder="Winner winner chicken dinner"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <HStack spacing={2}>
              {[1, 21, 50, 200, 500, 1000].map((amount) => (
                <Button
                  key={amount}
                  size="sm"
                  variant="outline"
                  onClick={() => onAmountChange(amount)}
                >
                  ⚡ {amount}
                </Button>
              ))}
            </HStack>

            <HStack>
              <Input placeholder="50" value={amount} onChange={onAmountInputChange} />
              <Button colorScheme="blue" px={10} onClick={onZapClick}>
                {isLoading
                  ? <Spinner />
                  : (
                    <HStack spacing={2}>
                      <Text>⚡</Text>
                      <Text>Zap {amount} sats</Text>
                    </HStack>
                  )}
              </Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ZapEventModal;
