import { CloseIcon, HamburgerIcon, UnlockIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useAsync } from "react-use";
import { useNostrClient } from "./nostr-tools/NostrClientProvider.tsx";

export function DiceNavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { client, lookupMetadata, isLoggedIn, setNewClient } = useNostrClient();

  const { value, error } = useAsync(async () => {
    if (client && isLoggedIn) {
      const signer = await client.signer();
      const publicKey = await signer.publicKey();
      const metadata = await lookupMetadata(publicKey);
      return { metadata, publicKey };
    } else {
      return undefined;
    }
  }, [client, isLoggedIn]);

  const metadata = value?.metadata;
  const publickey = value?.publicKey;

  if (error) {
    console.error(`Failed fetching metadata of notes in nav bar.`, error);
  }

  // const isLoggedIn = metadata !== undefined;

  const pubkeyString = publickey?.toBech32();

  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"center"}>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
          </HStack>
        </HStack>
        <Flex alignItems={"center"}>
          {isLoggedIn
            ? (
              <Stack>
                <Box>
                  <Text as="b">
                    {metadata?.getDisplayName()}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs">
                    {pubkeyString?.slice(0, 7) + "..."
                      + pubkeyString?.slice(pubkeyString?.length - 5, pubkeyString?.length)}
                  </Text>
                </Box>
              </Stack>
            )
            : (
              <Button
                variant={"solid"}
                colorScheme={"teal"}
                size={"sm"}
                mr={4}
                leftIcon={<UnlockIcon />}
                onClick={async () => {
                  await setNewClient();
                }}
              >
                Login
              </Button>
            )}
          {isLoggedIn
            ? (
              <Avatar
                size={"sm"}
                src={metadata?.getPicture()}
              />
            )
            : (
              <Avatar
                size={"sm"}
                src={undefined}
              />
            )}
        </Flex>
      </Flex>
    </Box>
  );
}
