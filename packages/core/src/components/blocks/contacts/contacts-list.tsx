"use client";

import React from "react";
import { InfiniteScroll } from "../infinite-scroll";
import { Customer } from "@/types";
import { useDebounce } from "@/utils/hooks";
import { useGetContacts } from "@/utils/queries";
import { BoxProps, Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { ContactListItem } from "./contacts-list-item";

export interface ContactsListProps extends BoxProps {
  params?: {
    q?: string;
    page?: number;
    per_page?: number;
    channel_id?: string;
  };
  onSelectContact?(contact: Customer): void;
  isContactItemActive?(chat: Customer): boolean;
}

export const ContactsList = ({
  params,
  onSelectContact,
  isContactItemActive,
  ...props
}: ContactsListProps) => {
  const debouncedSearchQuery = useDebounce(params?.q ?? "", 1500);

  const { data, fetchNextPage, hasNextPage } = useGetContacts({
    ...params,
    q: debouncedSearchQuery || undefined,
  });

  const contacts = data?.pages.flatMap((t) => t.customers);

  if (!contacts?.length) {
    return (
      <Flex py={20} align="center" justify="center" textAlign="center">
        <Heading>No contacts</Heading>
      </Flex>
    );
  }

  return (
    <InfiniteScroll
      flex={1}
      overflowY="auto"
      hasMore={hasNextPage}
      loadMore={fetchNextPage}
      loader={
        <Flex align="center" justify="center" py={2}>
          <Spinner size="sm" />
        </Flex>
      }
      endMessage={
        <Text py={2} textAlign="center" textStyle="xs" color="fg.muted">
          Nothing more to load
        </Text>
      }
      {...props}
    >
      {contacts.map((c) => (
        <ContactListItem
          contact={c}
          key={c.uuid}
          isActive={isContactItemActive?.(c)}
          onSelectContact={onSelectContact}
        />
      ))}
    </InfiniteScroll>
  );
};
