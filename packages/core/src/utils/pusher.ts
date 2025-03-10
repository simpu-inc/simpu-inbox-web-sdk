import Pusher, { PresenceChannel } from "pusher-js";
import { constants } from "./constants";

let pusher: Pusher;

const initializePusher = (token?: string, organisation_id?: string) => {
  if (!pusher) {
    const headers = {
      authorization: token,
      organisationID: organisation_id,
    };
    pusher = new Pusher(constants.PUSHER_APP_KEY || "", {
      userAuthentication: {
        headers,
        transport: "ajax",
        endpoint: `${constants.CONVERSATION_API_URL}/auth/websocket`,
      },
      channelAuthorization: {
        headers,
        transport: "ajax",
        endpoint: `${constants.CONVERSATION_API_URL}/auth/websocket/channel`,
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
