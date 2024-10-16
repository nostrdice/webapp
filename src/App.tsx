import { Box, ChakraProvider, Spacer } from "@chakra-ui/react";
import { DiceNavBar } from "./DiceNavBar.tsx";
import OddsMultiplierSelector from "./game/OddsMultiplierSelector.tsx";
import { NostrClientProvider } from "./nostr-tools/NostrClientProvider.tsx";
import WithBackgroundImage from "./WithBackgroundImage.tsx";

function App() {
  return (
    <ChakraProvider>
      <NostrClientProvider>
        <>
          <Box sx={{ position: "sticky", top: "0", zIndex: "1" }}>
            <DiceNavBar />
          </Box>
          <WithBackgroundImage />
          <Box p={4} bg="gray.50" overflowY="auto">
            <OddsMultiplierSelector />
          </Box>
          <Spacer />
        </>
      </NostrClientProvider>
    </ChakraProvider>
  );
}

export default App;
