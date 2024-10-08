import { Thread, UserProfile, UserTying } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import PrivateChannel from "pusher-js/types/src/core/channels/private_channel";
import { useEffect, useState } from "react";
import { pusher } from "./pusher";
import { QueryKeys } from "./queries";

/**
 * https://dev.to/arnonate/debouncing-react-query-with-hooks-2ek6
 */
export const useDebounce = (value: string, delay: number = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler: NodeJS.Timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useInboxWebsocket = (options: {
  profile?: UserProfile;
  onNewWebsocketEvent(): void;
  onUserIsTypingEvent(payload?: UserTying): void;
}) => {
  const { profile, onNewWebsocketEvent, onUserIsTypingEvent } = options;

  const queryClient = useQueryClient();

  const profile_id = profile?.id;

  useEffect(() => {
    if (!(profile_id && pusher)) {
      return;
    }

    const clearInterval = 900;
    let clearTimerId: ReturnType<typeof setTimeout>;

    const messageCallback = async (data: {
      thread_ids: string[];
      author_id?: string;
    }) => {
      const author_id = data.author_id;
      const thread_ids = data.thread_ids;

      const messagesQueryKey = thread_ids.map((t) => [
        QueryKeys.getMessages,
        t,
      ]);

      await Promise.all(
        [
          [QueryKeys.getUnreadCounts],
          [QueryKeys.getInboxThreads],
          ...messagesQueryKey,
        ].map((queryKey) => queryClient.invalidateQueries({ queryKey }))
      );

      if (author_id !== profile_id) {
        onNewWebsocketEvent();
      }
    };

    const threadNewCallback = async (data: {
      author_id?: string;
      thread_ids: string[];
    }) => {
      const threadIdsQueryKey = data.thread_ids.map((t) => [
        QueryKeys.getThread,
        t,
      ]);

      await Promise.all(
        threadIdsQueryKey.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey })
        )
      );

      if (data?.author_id !== profile_id) {
        onNewWebsocketEvent();
      }
    };

    const userTypingCallback = async (data: UserTying) => {
      const { typer_id, thread_id, user_type, typer_info, message_type } = data;
      onUserIsTypingEvent({
        user_type,
        thread_id,
        typer_id,
        typer_info,
        message_type,
      });
      clearTimeout(clearTimerId);
      clearTimerId = setTimeout(() => {
        onUserIsTypingEvent(undefined);
      }, clearInterval);
    };

    const assignCallback = async (data: { thread: Thread }) => {
      const thread_id = data.thread.uuid;

      queryClient.invalidateQueries({
        queryKey: [QueryKeys.getInboxThreads, thread_id],
      });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.getInboxThreads] });
    };

    const messageStatusCallback = async (
      data: { thread_id: string; messages: { uuid: string; state: string }[] }[]
    ) => {
      await Promise.all(
        data.map(({ thread_id }) =>
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.getMessages, thread_id],
          })
        )
      );
    };

    const subscribeToProfileChannel = () => {
      const userChannelName = `private-profile-${profile_id}`;
      let userChannel = pusher?.channel(userChannelName);

      if (!userChannel) {
        userChannel = pusher.subscribe(userChannelName) as PrivateChannel;
      }

      if (userChannel) {
        userChannel.bind("thread_assigned", assignCallback);
        userChannel.bind("message_new", messageCallback);
        userChannel.bind("thread_new", threadNewCallback);
        userChannel.bind("user_typing", userTypingCallback);
        userChannel.bind("message_retry", messageCallback);
        userChannel.bind("message_delete", async () => {
          await Promise.all(
            [
              [QueryKeys.getUnreadCounts],
              [QueryKeys.getMessages],
              [QueryKeys.getInboxThreads],
            ].map((filter) =>
              queryClient.invalidateQueries({ queryKey: filter })
            )
          );
        });
        userChannel.bind("message_updated", messageStatusCallback);
      }
    };

    subscribeToProfileChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile_id, pusher]);
};
