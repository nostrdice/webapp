import NDK from "@nostr-dev-kit/ndk";
import { useAutoLogin, useNostrHooks } from "nostr-hooks";
import { RELAYS } from "./Constants.tsx";
import { DiceNavBar } from "./DiceNavBar.tsx";
import { NostrGame } from "./NostrGame.tsx";
import { NostrSocial } from "./social/NostrSocial.tsx";

const customNDK = new NDK({
  explicitRelayUrls: RELAYS,
});

function App() {
  useNostrHooks(customNDK);
  useAutoLogin();

  return (
    <>
      <DiceNavBar />
      <div className="flex flex-row">
        <div className="flex w-11/12 flex-col md:flex-row">
          <div className="my-2 size-full rounded-md border-2 border-dashed md:mx-2 md:w-9/12">
            <NostrGame />
          </div>
          <div className="my-2 size-full max-h-screen overflow-y-auto rounded-md border-2 border-dashed md:mx-2 md:w-3/12">
            <NostrSocial />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
