export function validateRelayURL(relay: string | URL) {
  if (typeof relay === "string" && relay.includes(",ws")) throw new Error("Can not have multiple relays in one string");
  const url = typeof relay === "string" ? new URL(relay) : relay;
  if (url.protocol !== "wss:" && url.protocol !== "ws:") throw new Error("Incorrect protocol");
  return url;
}
