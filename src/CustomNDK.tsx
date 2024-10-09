import NDK from "@nostr-dev-kit/ndk";
import { RELAYS } from "./Constants.tsx";

export let CUSTOM_NDK = new NDK({
  explicitRelayUrls: RELAYS,
});
