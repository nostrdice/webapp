export const RELAYS = [
  "wss://relay.nostrdice.com",
  "wss://relay.primal.net",
  "wss://relay.damus.io",
  "wss://relay.satsdays.com",
  "wss://relay.mutinywallet.com",
];

export const NOSTR_DICE_GAME_PK = "9c1636e342a90a6eb492a89424e71cd096fa719fdb5e7cf5ecc5f0c48e4c6788";
export const NOSTR_DICE_SOCIAL_PK = "9c1636e14717511761ce8628bf2a8b7c6f1ba0bd1b6ac45554dd5ac679809ee5";

export const getMatchNostrLink = () =>
  /(nostr:|@)?((npub|note|nprofile|nevent|nrelay|naddr)1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{58,})/gi;
