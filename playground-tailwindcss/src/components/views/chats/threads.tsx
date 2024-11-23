"use client";

import { ChatsList, Thread } from "@simpu/inbox-sdk";
import { Button } from "@/components/ui/button";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { LuMessageCircle } from "react-icons/lu";
import { SearchInput } from "./search";
import { useState } from "react";

export const ThreadsView = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { thread_id } = useParams<{ thread_id: string }>();

  const [chatQuery, setChatQuery] = useState("");

  const newChat = searchParams.get("new-chat") as string;
  const contactInfo = searchParams.get("contact-info") as string;

  const showNewChat = newChat && newChat === "show";
  const showContactInfo = contactInfo && contactInfo === "show";

  const newSearchParams = showContactInfo
    ? {
        "contact-info": "show",
      }
    : undefined;

  return (
    !showNewChat && (
      <>
        <div className="flex items-center h-[60px] px-6 w-full justify-between">
          <p className="text-lg font-bold">Chats</p>
          <Button
            size="sm"
            onClick={() =>
              push(
                `?${new URLSearchParams({
                  "new-chat": "show",
                  ...newSearchParams,
                })}`
              )
            }
          >
            <LuMessageCircle /> New chat
          </Button>
        </div>
        <div className="flex items-center h-[50px] px-3">
          <SearchInput
            value={chatQuery}
            placeholder="Search"
            onChange={(e) => setChatQuery(e.target.value)}
          />
        </div>
        <ChatsList
          params={{ q: chatQuery }}
          onChatListItemClick={(c) => push(`${c.uuid}`)}
          isChatItemActive={(c: Thread) => c.uuid === thread_id}
        />
      </>
    )
  );
};
