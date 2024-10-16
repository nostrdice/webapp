import { Button, Card, CardBody, CardFooter, Heading, Stack, Text } from "@chakra-ui/react";
import { Event } from "@rust-nostr/nostr-sdk";
import { useState } from "react";
import { FaBolt } from "react-icons/fa6";
import { extractMultiplier } from "./ExtractMultiplier.tsx";
import ZapEventModal from "./ZapDialog.tsx";

export interface GameCardProps {
  note: Event;
}

export function GameCard({ note }: GameCardProps) {
  const header = extractMultiplier(note.content);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      size={"xs"}
    >
      <div>
        <ZapEventModal
          gameProfilePubkey={note.author}
          event={note}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          multiplier={header}
        />
      </div>
      <Stack>
        <CardBody>
          <Heading size="md">{header}</Heading>
          <Text py="1">{note.content}</Text>
        </CardBody>

        <CardFooter>
          <Button variant="solid" colorScheme="blue" onClick={() => setIsOpen(true)}>
            Zap <FaBolt />
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
}
