import { Box, ChakraProvider, Spacer } from "@chakra-ui/react";
import { useAutoLogin, useNostrHooks } from "nostr-hooks";
import { CUSTOM_NDK } from "./CustomNDK.tsx";
import { DiceNavBar } from "./DiceNavBar.tsx";
import { NostrGame } from "./game/NostrGame.tsx";
import WithBackgroundImage from "./WithBackgroundImage.tsx";

function App() {
  useNostrHooks(CUSTOM_NDK);
  useAutoLogin();

  const currentDate = new Date();
  currentDate.setDate(1);
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setMonth(currentDate.getMonth() - 1);

  const since = currentDate.getTime() / 1000;
  return (
    <ChakraProvider>
      <Box sx={{ position: "sticky", top: "0", zIndex: "1" }}>
        <DiceNavBar />
      </Box>
      <WithBackgroundImage />
      <Box p={4} bg="gray.50" overflowY="auto">
        <NostrGame />
      </Box>
      <Spacer />
      <Box
        overflowX="auto"
        p={4}
        bg="gray.200"
        height="100hv"
        sx={{ position: "sticky", bottom: "0", zIndex: "1" }}
      >
        {/*<NostrSocial since={since} />*/}
      </Box>
    </ChakraProvider>
  );
}

export default App;
