import {DiceNavBar} from "./DiceNavBar.tsx";
import {NostrSocial} from "./NostrSocial.tsx";
import {NostrGame} from "./NostrGame.tsx";

function App() {
  return (
    <>
      <DiceNavBar></DiceNavBar>
      <div className="flex flex-row">
        <div className="relative h-screen w-1/12 justify-center">
        </div>
        <div className="flex w-11/12 flex-col md:flex-row">
          <div className="my-2 size-full rounded-md border-2 border-dashed md:mx-2 md:w-4/12">
              <NostrSocial/>
          </div>
          <div className="my-2 size-full rounded-md border-2 border-dashed md:mx-2 md:w-7/12">
              <NostrGame/>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
