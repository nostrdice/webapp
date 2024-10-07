import { ChakraProvider, Grid, GridItem } from "@chakra-ui/react";
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

  return (
    <ChakraProvider>
      <DiceNavBar />
      <Grid
        templateColumns="repeat(4, 1fr)"
        gap={4}
        h="200vh"
      >
        <GridItem colSpan={3} maxH="200vh" overflow="auto">
          <NostrGame />
        </GridItem>
        <GridItem colSpan={1} maxH="100%" overflow="auto">
          <NostrSocial />
        </GridItem>
      </Grid>
    </ChakraProvider>
  );
}

export default App;
