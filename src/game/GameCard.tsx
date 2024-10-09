import { Button, Card, CardBody, CardFooter, Heading, Stack, Text } from "@chakra-ui/react";
import { NDKEvent, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { useState } from "react";
import { FaBolt } from "react-icons/fa6";
import ZapEventModal from "./ZapDialog.tsx";

export interface GameCardProps {
  note: NDKEvent;
  gameProfile?: NDKUserProfile | undefined;
}

export function GameCard({ note, gameProfile }: GameCardProps) {
  let header = "";
  if (note.content.includes("1.05x")) {
    header = "1.05x";
  } else if (note.content.includes("1.1x")) {
    header = "1.1x";
  } else if (note.content.includes("1.33")) {
    header = "1.33";
  } else if (note.content.includes("1.5")) {
    header = "1.5";
  } else if (note.content.includes("2x")) {
    header = "2x";
  } else if (note.content.includes("3x")) {
    header = "3x";
  } else if (note.content.includes("5x")) {
    header = "5x";
  } else if (note.content.includes("10x")) {
    header = "10x";
  } else if (note.content.includes("100x")) {
    header = "100x";
  } else if (note.content.includes("50x")) {
    header = "50x";
  } else if (note.content.includes("1000x")) {
    header = "1000x";
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      size={"sm"}
    >
      <div>
        <ZapEventModal
          gameProfile={gameProfile}
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
