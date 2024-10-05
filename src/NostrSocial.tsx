import { FaBolt } from "react-icons/fa6";

export interface SocialCardProps {
  none?: boolean;
}

function SocialCard({}: SocialCardProps) {
  return (
    <div className="max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">10x</h5>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.
      </p>
      <button className="inline-flex items-center rounded-lg bg-blue-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Zap to win
        <FaBolt />
      </button>
    </div>
  );
}

export function NostrSocial() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <SocialCard />
      <SocialCard />
      <SocialCard />
      <SocialCard />
      <SocialCard />
    </div>
  );
}
