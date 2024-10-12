import { Box, Button, Flex, Stack, useBreakpointValue, VStack } from "@chakra-ui/react";
import NDK from "@nostr-dev-kit/ndk";
import { ZapEventStream } from "./zapStream/ZapEventStream.tsx";

interface WithBackgroundImageProps {
  ndk: NDK;
}

export default function WithBackgroundImage({ ndk }: WithBackgroundImageProps) {
  const handleClick = () => {
    window.open("https://github.com/NostrDice/nostrdice/blob/main/GAME.md", "_blank");
  };

  return (
    <Flex
      w={"full"}
      h={"30vh"}
      position="relative"
      backgroundImage={
        // TODO: dynamically fetch this from the profile
        "url(https://m.primal.net/JikZ.png)"
      }
      backgroundSize={"cover"}
      backgroundPosition={"center center"}
    >
      <VStack
        w={"full"}
        justify={"end"}
        px={useBreakpointValue({ base: 4, md: 8 })}
      >
        <Box padding={"4vh"}>
          <Stack maxW={"2xl"} align={"flex-start"} spacing={6}>
            <Stack direction={"row"}>
              <Button
                bg={"blue.400"}
                rounded={"full"}
                color={"white"}
                _hover={{ bg: "blue.500" }}
                onClick={handleClick}
              >
                How it works
              </Button>
            </Stack>
          </Stack>
        </Box>
      </VStack>

      <Box
        position="absolute"
        right={0}
        top={0}
        bottom={0}
        width="450px"
        bg="rgba(0, 0, 0, 0.5)"
        overflowY="auto"
        padding={4}
      >
        <ZapEventStream ndk={ndk} />
      </Box>
    </Flex>
  );
}
