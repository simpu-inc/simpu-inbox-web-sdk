"use client";

import React, { Suspense, useState } from "react";
import { ThreadHeader } from "./header";
import { Conversation, Message } from "@simpu/inbox-sdk";
import { useParams } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export const ThreadView = () => {
  const { thread_id } = useParams<{ thread_id: string }>();
  const [messageToReply, setMessageToReply] = useState<Message | undefined>();

  return (
    <>
      <Suspense>
        <ThreadHeader thread_id={thread_id} />
      </Suspense>
      <Conversation.Content
        thread_id={thread_id}
        setMessageToReply={setMessageToReply}
      />
      <Conversation.Footer
        thread_id={thread_id}
        messageToReply={messageToReply}
        onErrorCallback={(error) =>
          toaster.create({
            title: "Error",
            description: error?.message ?? error,
          })
        }
        onCancelMessageToReply={() => setMessageToReply(undefined)}
      />
    </>
  );
};
