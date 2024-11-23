"use client";

import {
  Customer,
  ContactsList,
  AccountSelect,
  AccountSelectValue,
  useSimpuProvider,
  useGetInboxAccounts,
  useAccountConnectOptions,
  ConversationFooterTextArea,
} from "@simpu/inbox-sdk";
import { ViewHeader } from "@/components/layout/content";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SearchInput } from "./search";

export const NewChatView = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { apiClient } = useSimpuProvider();
  const { inbox } = useAccountConnectOptions();
  const { data: userAccounts } = useGetInboxAccounts(inbox?.uuid ?? "", {
    enabled: !!inbox,
  });

  const [body, setBody] = useState<string | undefined>();
  const [contactsQuery, setContactsQuery] = useState("");
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<
    AccountSelectValue | undefined
  >();
  const [selectedContact, setSelectedContact] = useState<
    Customer | undefined
  >();

  const newChat = searchParams.get("new-chat") as string;
  const contactInfo = searchParams.get("contact-info") as string;

  const showNewChat = newChat && newChat === "show";
  const showContactInfo = contactInfo && contactInfo === "show";

  const newSearchParams = showContactInfo
    ? {
        "contact-info": "show",
      }
    : undefined;

  const handleStartChat = async () => {
    if (body) {
      try {
        setIsStartingChat(true);
        const { thread } = await apiClient.inbox.contents.startConversation(
          selectedAccount?.id ?? "",
          { body, to: [selectedContact?.platform_nick ?? ""] }
        );
        setIsStartingChat(false);
        push(`/${thread.uuid}`);
      } catch (error) {
        setIsStartingChat(false);
        console.log(error);
      }
    }
  };

  return (
    showNewChat && (
      <>
        <ViewHeader
          className="px-6"
          href={`${pathname}?${new URLSearchParams(newSearchParams)}`}
        >
          New chat
        </ViewHeader>
        <div className="px-4">
          <AccountSelect
            accounts={userAccounts ?? []}
            onSelectAccount={setSelectedAccount}
          />
        </div>
        <div className="px-4 h-[50px] items-center">
          <SearchInput
            value={contactsQuery}
            placeholder="Search contact to message"
            onChange={(e) => setContactsQuery(e.target.value)}
          />
        </div>
        {!!selectedContact && (
          <div className="px-4 h-[60px] w-full items-center">
            <ConversationFooterTextArea
              size="sm"
              value={body}
              placeholder="Type message here"
              onChange={(value) => setBody(value)}
            />
            <Button size="sm" disabled={!body} onClick={handleStartChat}>
              {isStartingChat ? "Sending..." : "Send"}
            </Button>
          </div>
        )}
        <ContactsList
          isContactItemActive={(c) => c.uuid === selectedContact?.uuid}
          params={{
            q: contactsQuery,
            channel_id: selectedAccount?.channel_id,
          }}
          onSelectContact={setSelectedContact}
        />
      </>
    )
  );
};
