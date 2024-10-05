import { NDKEvent, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { useProfile, useSubscribe } from "nostr-hooks";
import { NOSTR_DICE_SOCIAL_PK, RELAYS } from "./Constants.tsx";

export interface SocialCardProps {
  note: NDKEvent;
  profile: NDKUserProfile | null;
}

function SocialCard({ note, profile }: SocialCardProps) {
  return (
    <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <img
          className="size-8 rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500"
          src={profile?.image}
          alt="Bordered avatar"
        />
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {profile?.displayName}
        </h5>
        <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {note.created_at ? <FormattedDateDisplay timestamp={note.created_at!} /> : ""}
        </h6>
      </div>
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

  const { profile } = useProfile({ pubkey: NOSTR_DICE_SOCIAL_PK });

  return (
    <div className="grid grid-cols-1 gap-4">
      {events.sort((a, b) => {
        return (a.created_at && b.created_at) ? b.created_at - a.created_at : 0;
      }).map(note => {
        return <SocialCard note={note} key={note.id} profile={profile} />;
      })}
    </div>
  );
}

interface FormattedDateDisplayProps {
  timestamp: number;
}

const FormattedDateDisplay = ({ timestamp }: FormattedDateDisplayProps) => {
  const date = new Date(timestamp * 1000);
  const formatted = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  console.log(`unformatted ${timestamp}`);
  console.log(`t ${date}`);
  console.log(`formatted ${formatted}`);

  return (
    <small className="align-middle text-sm text-gray-500 dark:text-gray-400">
      ({formatted})
    </small>
  );
};
