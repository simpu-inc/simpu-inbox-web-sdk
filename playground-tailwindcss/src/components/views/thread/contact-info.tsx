"use client";

import { Button } from "@/components/ui/button";
import { Conversation } from "@simpu/inbox-sdk";
import { Link } from "next-view-transitions";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { MdClose } from "react-icons/md";

export const ThreadContactInfo = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { thread_id } = useParams<{ thread_id: string }>();

  const newChat = searchParams.get("new-chat") as string;
  const contactInfo = searchParams.get("contact-info") as string;

  const showContactInfo = contactInfo === "show";
  const showNewChat = newChat && newChat === "show";

  const newSearchParams = showNewChat
    ? {
        "new-chat": "show",
      }
    : undefined;

  return (
    showContactInfo && (
      <div className="flex flex-col gap-1 h-full w-[400px] max-w-[400px] border-l bg-white">
        <div className="h-[60px] bg-[#fafafa] px-4">
          <div className="flex flex-col gap-6 h-full items-center">
            <Link href={`${pathname}?${new URLSearchParams(newSearchParams)}`}>
              <Button size="icon" variant="ghost">
                <MdClose />
              </Button>
            </Link>
            <p className="font-medium text-lg">Contact info</p>
          </div>
        </div>
        <div className="flex flex-col gap-1 overflow-y-auto flex-1">
          <Conversation.ContactInfo thread_id={thread_id} />
          <Conversation.Media thread_id={thread_id} />
        </div>
      </div>
    )
  );
};
