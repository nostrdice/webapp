import {
  Box,
  Button,
  Flex,
  forwardRef,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
  useMultiStyleConfig,
  useTab,
  VStack,
} from "@chakra-ui/react";
import { AiFillThunderbolt, AiOutlineThunderbolt } from "react-icons/ai";
import { FaMessage, FaRegMessage } from "react-icons/fa6";
import { DmEventStream } from "./zapStream/DmEventStream.tsx";
import { ZapEventStream } from "./zapStream/ZapEventStream.tsx";

export default function WithBackgroundImage() {
  const handleClick = () => {
    window.open("https://github.com/NostrDice/nostrdice/blob/main/GAME.md", "_blank");
  };

  return (
    <Flex
      w={"full"}
      h={"30vh"}
      position="relative"
      backgroundImage={"url(/social-banner.png)"}
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              width="100%"
            >
              <Text
                textAlign="center"
                color={"white"}
                fontWeight={700}
                lineHeight={1.2}
                fontSize={useBreakpointValue({ base: "5xl", md: "8xl" })}
              >
                NostrDice
              </Text>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              width="100%"
            >
              <Text
                width="100%"
                textAlign="center"
                color="white"
                fontWeight={700}
                lineHeight={1.2}
                fontSize={useBreakpointValue({ base: "md", md: "2xl" })}
              >
                The legend is back. Only on Nostr.
              </Text>
            </Box>

            <Stack direction={"row"} justifyContent="center" width="100%">
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
        <CustomTabs />
      </Box>
    </Flex>
  );
}

const CustomTab = forwardRef((props, ref) => {
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps["aria-selected"];

  const styles = useMultiStyleConfig("Tabs", tabProps);

  const isFirstTab = tabProps.id.includes("tab-0");

  const firstTabUnSelected = <AiOutlineThunderbolt color={"white"} />;
  const firstTabSelected = <AiFillThunderbolt color={"white"} />;

  const secondTabUnSelected = <FaRegMessage color={"white"} />;
  const secondTabSelected = <FaMessage color={"white"} />;

  let icon;
  if (isFirstTab) {
    if (isSelected) {
      icon = firstTabSelected;
    } else {
      icon = firstTabUnSelected;
    }
  } else {
    if (isSelected) {
      icon = secondTabSelected;
    } else {
      icon = secondTabUnSelected;
    }
  }

  return (
    <Button __css={styles.tab} {...tabProps}>
      <Box
        as="span"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mr="2"
      >
        {icon}
        {isSelected
          ? (
            <Text color={"white"}>
              <strong>{tabProps.children}</strong>
            </Text>
          )
          : <Text color={"white"}>{tabProps.children}</Text>}
      </Box>
    </Button>
  );
});

function CustomTabs() {
  return (
    <Tabs colorScheme="green">
      <TabList>
        <CustomTab variant="enclosed" _selected={{ color: "white", bg: "rgba(255, 255, 255, 0.1)" }}>
          Latest Zaps
        </CustomTab>
        <CustomTab variant="enclosed" _selected={{ color: "white", bg: "rgba(255, 255, 255, 0.1)" }}>
          Personal results
        </CustomTab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ZapEventStream />
        </TabPanel>
        <TabPanel>
          <DmEventStream />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
