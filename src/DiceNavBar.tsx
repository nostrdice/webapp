"use client";

import { CloseIcon, HamburgerIcon, UnlockIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useActiveUser, useLogin } from "nostr-hooks";

export function DiceNavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    loginWithExtension,
    logout,
  } = useLogin();
  const { activeUser } = useActiveUser({ fetchProfile: true });
  const isLoggedIn = activeUser !== undefined;
  const profile = activeUser?.profile;

  return (
    <>
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
                      {profile?.displayName}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs">
                      {activeUser?.npub.slice(0, 7) + "..."
                        + activeUser?.npub.slice(activeUser?.npub.length - 5, activeUser?.npub.length - 1)}
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
                  onClick={() => loginWithExtension()}
                >
                  Login
                </Button>
              )}
            {isLoggedIn
              ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar
                      size={"sm"}
                      src={profile?.image}
                    />
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={logout}>Logout</MenuItem>
                  </MenuList>
                </Menu>
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
    </>
  );
}
