import { Box, ChakraProvider, Grid, GridItem } from "@chakra-ui/react";
import NDK from "@nostr-dev-kit/ndk";
import { useAutoLogin, useNostrHooks } from "nostr-hooks";
import { RELAYS } from "./Constants.tsx";
import { DiceNavBar } from "./DiceNavBar.tsx";
import { NostrGame } from "./game/NostrGame.tsx";
import { NostrSocial } from "./social/NostrSocial.tsx";

const customNDK = new NDK({
  explicitRelayUrls: RELAYS,
});

function App() {
  useNostrHooks(customNDK);
  useAutoLogin();

  const currentDate = new Date();
  currentDate.setDate(1);
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setMonth(currentDate.getMonth() - 1);

  const since = currentDate.getTime() / 1000;
  return (
    <ChakraProvider>
      <DiceNavBar />
      <Grid
        templateRows="1fr auto"
        height="100vh"
        width="100%"
      >
        <GridItem overflowY="auto">
          <Box p={4} bg="gray.50" height={"100%"}>
            <NostrGame />
          </Box>
        </GridItem>
        <GridItem overflowX="auto">
          <Box
            overflowX="auto"
            p={4}
            bg="gray.200"
          >
            <Box display="inline-block" height="100hv">
              <NostrSocial since={since} />
            </Box>
          </Box>
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
