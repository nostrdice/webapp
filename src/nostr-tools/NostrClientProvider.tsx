import {
  Client,
  ClientBuilder,
  Duration,
  Event,
  EventId,
  EventSource,
  Filter,
  initLogger,
  loadWasmSync,
  LogLevel,
  Metadata,
  Nip07Signer,
  NostrDatabase,
  NostrSigner,
  NostrZapper,
  PublicKey,
  RelayMessage,
} from "@rust-nostr/nostr-sdk";
import { createContext, ReactElement, useCallback, useContext, useEffect, useState } from "react";
import { RELAYS } from "../Constants.tsx";

interface NostrClientProviderProps {
  children: ReactElement;
}

// NostrClientProvider to wrap the app
export const NostrClientProvider = ({ children }: NostrClientProviderProps) => {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [subscriptions, setSubscriptions] = useState<Record<string, (event: Event) => void>>({});

  // Load WASM and initialize components
  loadWasmSync();

  useEffect(() => {
    const initializeClient = async () => {
      try {
        // Try to initialize log
        try {
          initLogger(LogLevel.info());
        } catch (error) {
          console.log(error);
        }

        const nipSigner = new Nip07Signer();
        const signer = NostrSigner.nip07(nipSigner);
        const zapper = await NostrZapper.webln(); // To use NWC: NostrZapper.nwc(uri);

        const db = await NostrDatabase.indexeddb("nostr-sdk-webapp-example");

        // Build client
        const client = new ClientBuilder()
          .signer(signer)
          .zapper(zapper)
          .database(db)
          .build();

        // Add relays
        for (let i = 0; i < RELAYS.length; i++) {
          await client.addRelay(RELAYS[i]);
        }

        // Connect the client
        await client.connect();

        // Set the client in state
        setClient(client);
        setInitialized(true);
      } catch (error) {
        console.error("Failed to initialize Nostr client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (initialized) {
      return;
    } else {
      initializeClient();
    }
  }, [initialized, client]);

  const subscribe = useCallback(async (subscriptionId: string, filter: Filter, callback: (event: Event) => void) => {
    const existingEvents = await client?.database.query([filter.clone()]);
    console.log(`Stored events found ${existingEvents?.length}`);
    const sorted = existingEvents?.sort((a, b) => b.createdAt.asSecs() - a.createdAt.asSecs());

    if (sorted?.length && sorted?.length > 0) {
      for (let i = 0; i < 20; i++) {
        callback(sorted[i]);
      }
      const newest = sorted[0].createdAt;
      if (newest) {
        // Filter.fromJson(providedFilter.asJson())
        // console.log(`filter: `);
        // console.log(`Newest ${newest.toHumanDatetime()}`);
        // filter = providedFilter.since(newest);
      }
    }

    const updatedSubscriptions = { ...subscriptions, [subscriptionId]: callback };
    console.log(`Subscribing to new event ${subscriptionId}`);
    const handle = {
      handleEvent: async (_relayUrl: string, subscriptionId: string, event: Event) => {
        const callback = updatedSubscriptions[subscriptionId];
        if (callback) {
          // console.log(`Received an event for ${subscriptionId}`);
          callback(event);
        } else {
          console.error(
            `Received an event for ${subscriptionId} but no active subscription present `,
            event.kind.asU16(),
          );
        }
        return false;
      },
      // Handle relay message
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handleMsg: async (_relayUrl: string, _message: RelayMessage) => {
        return false;
      },
    };

    client!.handleNotifications(handle);

    client!.subscribeWithId(subscriptionId, [filter]);
    setSubscriptions(updatedSubscriptions);
  }, [client, subscriptions]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unsubscribe = useCallback((_subscriptionId: string) => {
    // TODO: this throws an error
    // if (client) {
    //   client.unsubscribe(subscriptionId).then(() => {
    //     setSubscriptions(prev => {
    //       const rest = { ...prev };
    //       delete rest[subscriptionId];
    //       return rest;
    //     });
    //   });
    //
    // }
  }, [client]);

  const lookupMetadata = async (pubkey: PublicKey) => {
    const profile = await client?.database?.profile(pubkey);
    if (profile?.metadata().getName()) {
      return profile.metadata();
    }
    return client!.fetchMetadata(pubkey);
  };

  const lookupEvent = async (eventId: EventId) => {
    const event = await client?.database?.eventById(eventId);
    if (event) {
      return event;
    }
    const filter = new Filter().id(eventId);
    const source = EventSource.relays(Duration.fromSecs(10));
    const events = await client!.getEventsOf([filter], source);
    if (events.length > 0) {
      return events[0];
    } else {
      return undefined;
    }
  };

  return (
    <NostrClientContext.Provider
      value={{ client, isLoading, subscribe, unsubscribe, lookupMetadata, initialized, lookupEvent }}
    >
      {children}
    </NostrClientContext.Provider>
  );
};

type NostrClientContextType = {
  client: Client | null;
  isLoading: boolean;
  initialized: boolean;
  subscribe: (eventId: string, filter: Filter, callback: (event: Event) => void) => Promise<void>;
  unsubscribe: (eventId: string) => void;
  lookupMetadata: (pubkey: PublicKey) => Promise<Metadata | undefined>;
  lookupEvent: (eventId: EventId) => Promise<Event | undefined>;
};

export const NostrClientContext = createContext<NostrClientContextType | undefined>(undefined);

// Hook to use NostrClient
export const useNostrClient = (): NostrClientContextType => {
  const context = useContext(NostrClientContext);
  if (!context) {
    throw new Error("useNostrClient must be used within a NostrClientProvider");
  }
  return context;
};
