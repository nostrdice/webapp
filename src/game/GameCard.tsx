import { Box, Button, Card, CardBody, CardFooter, Heading, Stack, Text } from "@chakra-ui/react";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { FaBolt } from "react-icons/fa6";

export interface GameCardProps {
  note: NDKEvent;
}

export function GameCard({ note }: GameCardProps) {
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

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
    >
      <Box maxWidth={"100%"} display="flex" justifyContent="center" alignItems="center" height="100%">
        <GlowingCircle emoji={extractFirstEmoji(note.content)} />
      </Box>

      <Stack>
        <CardBody>
          <Heading size="md">{header}</Heading>
          <Text py="1">{note.content}</Text>
        </CardBody>

        <CardFooter>
          <Button variant="solid" colorScheme="blue">
            Zap <FaBolt />
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
}

const extractFirstEmoji = (text: string) => {
  // this is ugly as a stray cat in the dumpster but works 😅
  return text.split(" ")[0];
};

interface GlowingCircleProps {
  emoji: string | null;
  bg?: string;
  size?: string;
}

const GlowingCircle: React.FC<GlowingCircleProps> = ({
  emoji = "✨",
  bg = "blue.50",
  size = "100px",
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={bg}
      borderRadius="full"
      border="1px solid blue"
      boxShadow={`0 0 20px ${bg}`}
      width={size}
      height={size}
      textAlign="center"
      fontSize="3xl"
      lineHeight={size}
      color="white"
      _hover={{
        boxShadow: `0 0 30px ${bg}`,
      }}
    >
      <Text>{emoji}</Text>
    </Box>
  );
};
