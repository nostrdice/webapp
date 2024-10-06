import { NDKEvent, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { buildContents } from "../utils/buildContents.tsx";
import { FormattedDateDisplay } from "./FormattedDateDisplay.tsx";

export interface SocialCardProps {
  note: NDKEvent;
  profile: NDKUserProfile | null;
}

export function SocialCard({ note, profile }: SocialCardProps) {
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
        <ContentWithNpubs event={note} />
      </p>
    </div>
  );
}

const ContentWithNpubs = ({ event }: { event: NDKEvent }) => {
  const inner = buildContents(event);

  return <>{inner}</>;
};
