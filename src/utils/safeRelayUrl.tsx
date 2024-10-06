import { validateRelayURL } from "./validateRelayURL.tsx";

export function safeRelayUrl(relayUrl: string | URL) {
  try {
    return validateRelayURL(relayUrl).toString();
  } catch (e) {
    return null;
  }
}
