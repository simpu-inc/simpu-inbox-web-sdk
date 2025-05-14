import Pusher, { PresenceChannel } from "pusher-js";
import { constants } from "./constants";

let pusher: Pusher;

const initializePusher = (
  token?: string,
  organisation_id?: string,
  conversationApiUrl: string = constants.CONVERSATION_API_URL,
  env: "development" | "production" = "development"
) => {
  if (!pusher) {
    const headers = {
      authorization: token,
      organisationID: organisation_id,
    };
    const appKey =
      env === "development"
        ? constants.PUSHER_APP_KEY_DEV
        : constants.PUSHER_APP_KEY_PROD;

    pusher = new Pusher(appKey, {
      userAuthentication: {
        headers,
        transport: "ajax",
        endpoint: `${conversationApiUrl}/auth/websocket`,
      },
      channelAuthorization: {
        headers,
        transport: "ajax",
        endpoint: `${conversationApiUrl}/auth/websocket/channel`,
      },
      forceTLS: true,
      cluster: "eu",
    });

    pusher.signin();

    pusher.connection.bind("error", function (error: any) {
      console.error("connection error", error);
    });
  }
};

const subscribeToPresenceChannel = (channelName: string) => {
  const name = `private-${channelName.replace("|", "")}`;
  const channel = pusher.channel(channelName) as PresenceChannel;

  if (channel) {
    return channel;
  }

  return pusher.subscribe(name) as PresenceChannel;
};

const isMemberOnline = (organisation_id: string, user_id: string) => {
  const organisationPresenceChannel = <PresenceChannel>(
    pusher?.channels?.channels?.[`presence-organisation-${organisation_id}`]
  );
  return organisationPresenceChannel?.members?.get(user_id);
};

export { pusher, initializePusher, subscribeToPresenceChannel, isMemberOnline };
