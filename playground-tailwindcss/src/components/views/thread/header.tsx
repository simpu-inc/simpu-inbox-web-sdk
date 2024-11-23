"use client";

import { Button } from "@/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Conversation,
  QueryKeys,
  Thread,
  useSimpuProvider,
} from "@simpu/inbox-sdk";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "next-view-transitions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GrMoreVertical } from "react-icons/gr";

export const ThreadHeader = ({ thread_id }: { thread_id: string }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { apiClient } = useSimpuProvider();

  const newChat = searchParams.get("new-chat") as string;

  const showNewChat = newChat && newChat === "show";

  const newSearchParams = showNewChat
    ? {
        "new-chat": "show",
      }
    : undefined;

  const url = `${pathname}?${new URLSearchParams({
    "contact-info": "show",
    ...newSearchParams,
  })}`;

  const handlePinChat = async () => {
    try {
      await apiClient.inbox.threads.favorite(thread_id);
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getThread, thread_id],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnPinChat = async () => {
    try {
      await apiClient.inbox.threads.unfavorite(thread_id);
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getThread, thread_id],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePinningAction = (thread?: Thread) => {
    if (thread) {
      if (!thread.is_favorited) {
        handlePinChat();
      } else {
        handleUnPinChat();
      }
    }
  };

  return (
    <Conversation.Header
      cursor="pointer"
      thread_id={thread_id}
      onClick={() => push(url)}
    >
      {(thread) => (
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Button size="icon" variant="ghost">
                <GrMoreVertical />
              </Button>
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem asChild className="cursor-pointer">
                <Link href={url}>Contact info</Link>
              </MenubarItem>
              <MenubarItem onSelect={() => handlePinningAction(thread)}>
                {thread?.is_favorited ? "Unpin" : "Pin"} chat
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
    </Conversation.Header>
  );
};
