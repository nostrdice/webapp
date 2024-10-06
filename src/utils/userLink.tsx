import { useProfile } from "nostr-hooks";

export interface UserLinkProps {
  pubkey: string;
  color: string;
}

export const UserLink = ({ pubkey, color }: UserLinkProps) => {
  const { profile } = useProfile({ pubkey: pubkey });
  // TODO: use nostr-tools or similar to convert pubkey to npub
  const npub = pubkey;

  return (
    <a
      href={`https://nostrudel.ninja/#/u/${npub}`}
      style={{ color: color, textDecoration: "none" }}
    >
      {profile?.displayName || pubkey}
    </a>
  );
};
