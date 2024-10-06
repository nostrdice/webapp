import { useActiveUser, useLogin } from "nostr-hooks";

export function DiceNavBar() {
  const {
    loginWithExtension,
  } = useLogin();
  const { activeUser } = useActiveUser({ fetchProfile: true });
  const isLoggedIn = activeUser !== undefined;
  const profile = activeUser?.profile;

  function onLoginClick() {
    loginWithExtension();
  }

  return (
    <nav className="border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">NostrDice</span>
        </div>
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="size-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0 md:dark:bg-gray-900 rtl:space-x-reverse">
            <li>
              {isLoggedIn
                ? (
                  <div className="flex items-center justify-end space-x-3">
                    <span className="hidden text-right lg:block">
                      <span className="block text-sm font-medium text-black dark:text-white">
                        {profile?.displayName}
                      </span>
                      <span className="block text-xs">
                        {activeUser?.npub.slice(0, 7) + "..."
                          + activeUser?.npub.slice(activeUser?.npub.length - 5, activeUser?.npub.length - 1)}
                      </span>
                    </span>

                    {profile?.image
                      ? (
                        <img
                          className="size-10 rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500"
                          src={profile?.image}
                          alt="Bordered avatar"
                        />
                      )
                      : (
                        <div className="relative size-10 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-600">
                          <svg
                            className="absolute -left-1 size-12 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clip-rule="evenodd"
                            >
                            </path>
                          </svg>
                        </div>
                      )}
                  </div>
                )
                : (
                  <button
                    className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:border-0 md:p-0 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:bg-transparent md:dark:hover:text-blue-500"
                    onClick={onLoginClick}
                  >
                    Login
                  </button>
                )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
