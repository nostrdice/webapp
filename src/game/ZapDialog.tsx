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
import { requestProvider } from "@getalby/bitcoin-connect-react";
import { NDKEvent, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { X } from "lucide-react";
import { useNdk } from "nostr-hooks";
import React, { useState } from "react";

interface ZapEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameProfile?: NDKUserProfile | undefined;
  event: NDKEvent;
  multiplier: string;
}

const ZapEventModal = ({ isOpen, onClose, gameProfile, event, multiplier }: ZapEventModalProps) => {
  const [amount, setAmount] = useState(21);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onAmountChange(amount: number) {
    setAmount(amount);
  }

  function onAmountInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const amount = parseInt(e.target.value, 10);
    setAmount(amount);
  }

  const { ndk } = useNdk();

  const onZapClick = () => {
    setIsLoading(true);
    requestProvider().then((provider) => {
      ndk.zap(
        event,
        amount * 1000,
        {
          comment: comment,
          onComplete: () => {
            // TODO: show confetti to user
            onClose();
            setIsLoading(false);
            return undefined;
          },
          onLnPay: async ({ pr }) => {
            if (provider) {
              return provider.sendPayment(pr);
            } else {
              alert("No payment provider found. Install alby?");
              return undefined;
            }
          },
        },
      );
    });
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
                  src={gameProfile?.image}
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="bold">{gameProfile?.displayName}</Text>
                  <Text fontSize="sm" color="gray.500">{gameProfile?.lud16}</Text>
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
