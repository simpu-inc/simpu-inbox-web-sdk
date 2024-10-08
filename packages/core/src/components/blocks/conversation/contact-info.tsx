"use client";

import React from "react";
import { Avatar, AvatarProps } from "@/components/ui/avatar";
import { useGetThread } from "@/utils/queries";
import {
  Heading,
  HeadingProps,
  Stack,
  StackProps,
  Text,
  TextProps,
} from "@chakra-ui/react";

export const ConversationContactInfoAvatar = (props: AvatarProps) => (
  <Avatar {...props} />
);
export const ConversationContactInfoHeading = (props: HeadingProps) => (
  <Heading {...props} />
);
export const ConversationContactInfoText = (props: TextProps) => (
  <Text {...props} />
);

export interface ConversationContactInfoProps extends StackProps {
  thread_id: string;
}

export const ConversationContactInfo = ({
  thread_id,
  ...props
}: ConversationContactInfoProps) => {
  const { data: thread } = useGetThread(thread_id);

  const { sender } = thread ?? {};

  return (
    <Stack py={6} align="center" justify="center" bg="bg.subtle" {...props}>
      <ConversationContactInfoAvatar
        size="2xl"
        src={sender?.image_url ?? ""}
        name={sender?.name ?? sender?.platform_name}
      />
      <Stack gap={0} align="center" justify="center">
        <ConversationContactInfoHeading>
          {sender?.name}
        </ConversationContactInfoHeading>
        <ConversationContactInfoText
          fontWeight={500}
          textStyle="sm"
          color="fg.muted"
        >
          {sender?.platform_nick}
        </ConversationContactInfoText>
      </Stack>
    </Stack>
  );
};
