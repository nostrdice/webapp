import { Avatar, Card, CardBody, CardHeader, Heading, HStack, Text } from "@chakra-ui/react";
import { NDKEvent, NDKUserProfile } from "@nostr-dev-kit/ndk";
import { buildContents } from "../utils/buildContents.tsx";
import { FormattedDateDisplay } from "./FormattedDateDisplay.tsx";

export interface SocialCardProps {
  note: NDKEvent;
  profile: NDKUserProfile | null;
}

export function SocialCard({ note, profile }: SocialCardProps) {
  return (
    <Card variant={"elevated"}>
      <CardHeader>
        <Heading size="md">
          <HStack>
            <Avatar
              size={"sm"}
              src={profile?.image}
            />
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {profile?.displayName}
            </h5>
            <h6 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {note.created_at ? <FormattedDateDisplay timestamp={note.created_at!} /> : ""}
            </h6>
          </HStack>
        </Heading>
      </CardHeader>
      <CardBody>
        <Text>
          <ContentWithNpubs event={note} />
        </Text>
      </CardBody>
    </Card>
  );
}

const ContentWithNpubs = ({ event }: { event: NDKEvent }) => {
  const inner = buildContents(event);

  return <>{inner}</>;
};
