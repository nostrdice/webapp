import { Box, ChakraProvider, Spacer } from "@chakra-ui/react";
import { useAutoLogin, useNostrHooks } from "nostr-hooks";
import { useMemo } from "react";
import { CUSTOM_NDK } from "./CustomNDK.tsx";
import { DiceNavBar } from "./DiceNavBar.tsx";
import { NostrGame } from "./game/NostrGame.tsx";
import WithBackgroundImage from "./WithBackgroundImage.tsx";

function App() {
  const ndk = useMemo(() => CUSTOM_NDK, []);
  useNostrHooks(ndk);
  useAutoLogin();

  return (
    <ChakraProvider>
      <Box sx={{ position: "sticky", top: "0", zIndex: "1" }}>
        <DiceNavBar />
      </Box>
      <WithBackgroundImage ndk={ndk} />
      <Box p={4} bg="gray.50" overflowY="auto">
        <NostrGame />
      </Box>
      <Spacer />
    </ChakraProvider>
  );
}

export default App;
