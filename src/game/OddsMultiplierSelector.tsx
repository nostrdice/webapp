import {
  Box,
  Button,
  Heading,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Duration, EventSource, Filter, Kind, PublicKey } from "@rust-nostr/nostr-sdk";
import { useState } from "react";
import { FaBolt } from "react-icons/fa6";
import { useAsync } from "react-use";
import { NOSTR_DICE_GAME_PK } from "../Constants.tsx";
import { useNostrClient } from "../nostr-tools/NostrClientProvider.tsx";
import { extractMultiplier } from "./ExtractMultiplier.tsx";
import ZapEventModal from "./ZapDialog.tsx";

const multipliers = [
  { value: 1000, chance: 0.10 },
  { value: 100, chance: 0.97 },
  { value: 50, chance: 1.94 },
  { value: 25, chance: 3.88 },
  { value: 10, chance: 9.70 },
  { value: 3, chance: 32.33 },
  { value: 2, chance: 48.50 },
  { value: 1.5, chance: 64.67 },
  { value: 1.33, chance: 72.93 },
  { value: 1.1, chance: 88.18 },
  { value: 1.05, chance: 92.38 },
];

const indexOfMultiplier = (multipler: number) => {
  const found = multipliers.find((m) => {
    return (m.value === multipler);
  });
  if (!found) {
    return undefined;
  }
  return multipliers.indexOf(found);
};

const indexToMultiplier = (index: number) => {
  return multipliers[index];
};

const OddsMultiplierSelector = () => {
  const [selectedSliderIndex, setSelectedSliderIndex] = useState(5);
  const [selectedMultiplier, setSelectedMultiplier] = useState(indexToMultiplier(5)!);
  const [isOpen, setIsOpen] = useState(false);

  const { client, initialized } = useNostrClient();

  const { loading, value: maybeEvents, error } = useAsync(async () => {
    if (client && initialized) {
      const pubkey = PublicKey.fromHex(NOSTR_DICE_GAME_PK);
      const filter = new Filter().author(pubkey).kind(new Kind(1));
      const source = EventSource.relays(Duration.fromSecs(10));
      return client!.getEventsOf([filter], source);
    } else {
      return [];
    }
  }, [client, initialized]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    console.error(`Failed fetching game notes here`, error);
  }

  const events = maybeEvents ?? [];

  const handleSliderChange = (value: number) => {
    setSelectedMultiplier(indexToMultiplier(value));
    setSelectedSliderIndex(value);
  };

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
    color: "white",
  };

  const selectedNote = events.find((e) => e.content.includes(`${selectedMultiplier.value}x`));
  const header = selectedNote ? `${extractMultiplier(selectedNote.content)}` : undefined;

  const content = selectedNote?.content;
  const multiplierHeadingFinePrint = `${selectedMultiplier.chance}% chance to win`;
  const multiplierHeading = `${selectedMultiplier.value}x`;

  return (
    <Box
      maxWidth="1200px"
      margin="auto"
      padding={6}
      borderRadius="lg"
      boxShadow="xl"
      bgGradient="linear(to-r, blue.400, purple.500)"
      color="white"
    >
      <Box
        maxWidth="900px"
        margin="auto"
        height={"240px"}
        padding={6}
        borderRadius="lg"
        boxShadow="xl"
        background={"whiteAlpha.300"}
      >
        <Text fontSize="2xl" fontWeight="bold" color="white" mb={4} textAlign="center">
          Select Your Odds & Win Multiplier
        </Text>

        <Wrap spacing={2} justify="center" mb={4}>
          {multipliers.map((mult) => (
            <WrapItem key={mult.value}>
              <Button
                size="md"
                width={"70px"}
                variant={selectedMultiplier.value === mult.value ? "solid" : "outline"}
                colorScheme={selectedMultiplier.value === mult.value ? "teal" : "gray"}
                color={"white"}
                onClick={() => handleSliderChange(indexOfMultiplier(mult.value)!)}
              >
                <VStack>
                  <Text>{mult.value}x</Text>
                </VStack>
              </Button>
            </WrapItem>
          ))}
        </Wrap>

        <Box p={4} pt={6} display={{ base: "none", lg: "block" }}>
          <Slider
            min={0}
            max={10}
            step={1}
            value={selectedSliderIndex}
            aria-label="slider-ex-6"
            onChange={(val) => handleSliderChange(val)}
          >
            {multipliers.map((mult) => {
              const value = indexOfMultiplier(mult.value)!;
              return (
                <SliderMark key={mult.value} value={value} {...labelStyles} ml="-5" mt="7">
                  {mult.chance}%
                </SliderMark>
              );
            })}

            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
      </Box>
      <Box paddingTop={"5"}>
        {(content && header)
          ? (
            <>
              <ZapEventModal
                gameProfilePubkey={selectedNote.author}
                event={selectedNote}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                multiplier={header}
              />
              <Box
                maxWidth="450px"
                margin="auto"
                padding={6}
                borderRadius="lg"
                boxShadow="xl"
                background={"whiteAlpha.300"}
              >
                <VStack>
                  <Heading size={"xs"}>{multiplierHeadingFinePrint}</Heading>
                  <Heading size={"2xl"}>{multiplierHeading}</Heading>
                  <Box display="flex" justifyContent="center">
                    <Text py="1" textAlign="center">
                      {content}
                    </Text>
                  </Box>
                  <Button variant="solid" colorScheme="blue" onClick={() => setIsOpen(true)}>
                    Zap <FaBolt />
                  </Button>
                </VStack>
              </Box>
            </>
          )
          : ""}
      </Box>
    </Box>
  );
};

export default OddsMultiplierSelector;
