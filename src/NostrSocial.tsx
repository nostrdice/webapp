import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useSubscribe } from "nostr-hooks";
import { NOSTR_DICE_SOCIAL_PK, RELAYS } from "./Constants.tsx";

export interface SocialCardProps {
  note: NDKEvent;
}

function SocialCard({ note }: SocialCardProps) {
  return (
    <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {note.content}
      </p>
    </div>
  );
}

const filter = [{ authors: [NOSTR_DICE_SOCIAL_PK], kinds: [1] }];

export function NostrSocial() {
  const { events } = useSubscribe({
    filters: filter,
    relays: RELAYS,
  });

  return (
    <div className="grid grid-cols-1 gap-4">
      {events.sort((a, b) => {
        return (a.created_at && b.created_at) ? b.created_at - a.created_at : 0;
      }).map(note => {
        return <SocialCard note={note} key={note.id} />;
      })}
    </div>
  );
}
