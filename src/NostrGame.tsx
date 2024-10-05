import { NDKEvent } from "@nostr-dev-kit/ndk";
import { useSubscribe } from "nostr-hooks";
import { FaBolt } from "react-icons/fa6";
import { NOSTR_DICE_GAME_PK, RELAYS } from "./Constants.tsx";

export interface GameCardProps {
  note: NDKEvent;
}

function GameCard({ note }: GameCardProps) {
  let header = "";
  if (note.content.includes("1.05x")) {
    header = "1.05x";
  } else if (note.content.includes("1.1x")) {
    header = "1.1x";
  } else if (note.content.includes("1.33")) {
    header = "1.33";
  } else if (note.content.includes("1.5")) {
    header = "1.5";
  } else if (note.content.includes("2x")) {
    header = "2x";
  } else if (note.content.includes("3x")) {
    header = "3x";
  } else if (note.content.includes("5x")) {
    header = "5x";
  } else if (note.content.includes("10x")) {
    header = "10x";
  } else if (note.content.includes("100x")) {
    header = "100x";
  } else if (note.content.includes("50x")) {
    header = "50x";
  } else if (note.content.includes("1000x")) {
    header = "1000x";
  }

  return (
    <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{header}</h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {note.content}
      </p>
      <button className="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Zap to win
        <FaBolt />
      </button>
    </div>
  );
}

const filter = [{ authors: [NOSTR_DICE_GAME_PK], kinds: [1] }];

export function NostrGame() {
  const { events } = useSubscribe({
    filters: filter,
    relays: RELAYS,
  });

  return (
    <div className="grid grid-cols-3 gap-4">
      {events.sort((a, b) => {
        return (a.created_at && b.created_at) ? b.created_at - a.created_at : 0;
      }).map(note => {
        return <GameCard note={note} key={note.id} />;
      })}
    </div>
  );
}
