"use client";

import { AssignLogEntity, Message } from "@/types";
import { Stack, StackProps, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import React from "react";

interface LogItemProps<T> extends StackProps {
  entity?: T;
  type: string;
  isLoggedInUser: boolean;
  author: Message["author"];
  created_datetime: Message["created_datetime"];
}

interface ConversationLogItemProps extends StackProps {
  entity: any;
  isLoggedInUser: boolean;
  author: Message["author"];
  messageType: Message["sub_type"];
  created_datetime: Message["created_datetime"];
}

export const ConversationLogItem = (props: ConversationLogItemProps) => {
  const { messageType, entity, author, created_datetime, ...rest } = props;

  const logItemProps = {
    type: messageType,
    entity,
    author,
    created_datetime,
    ...rest,
  };

  switch (messageType) {
    case "assign":
    case "unassign":
      return <AssignLogItem {...logItemProps} />;
    case "resolve":
    case "undo-resolve":
      return <ResolveLogItem {...logItemProps} />;
    case "start":
      return <StartLogItem {...logItemProps} />;
    case "reopen":
      return <ReopenLogItem {...logItemProps} />;
    default:
      return null;
  }
};

interface LogItemContainerProps extends StackProps {
  type: string;
  created_datetime: string;
}

const AssignLogItem = (props: LogItemProps<AssignLogEntity>) => {
  const { type, entity, author, created_datetime, isLoggedInUser, ...rest } =
    props;

  return (
    <LogItem type={type} created_datetime={created_datetime} {...rest}>
      <Stack
        flexWrap="wrap"
        color="gray.500"
        direction="row"
        alignItems="center"
      >
        <Text textStyle="xs" fontWeight="bold" position="relative" top="1px">
          {type === "assign" ? "Assigned" : "Unassigned"}
        </Text>
        <Text textStyle="xs">{type === "assign" ? "to" : "from"}</Text>
        {isLoggedInUser ? (
          <Text>you</Text>
        ) : (
          <>
            <Text textStyle="xs" textTransform="capitalize">
              {entity?.name}
            </Text>
            <Text textStyle="xs">
              by {isLoggedInUser ? "you" : author?.name}
            </Text>
          </>
        )}
      </Stack>
    </LogItem>
  );
};

const ResolveLogItem = (props: LogItemProps<undefined>) => {
  const { type, author, isLoggedInUser, created_datetime, ...rest } = props;

  return (
    <LogItem type={type} created_datetime={created_datetime} {...rest}>
      <Stack
        flexWrap="wrap"
        color="fg.muted"
        direction="row"
        alignItems="center"
      >
        <Text textStyle="xs" fontWeight="bold" position="relative" top="1px">
          {type === "resolve" ? `Resolved` : `Re-opened`}
        </Text>
        <Text textStyle="xs">by {isLoggedInUser ? "you" : author?.name}</Text>
      </Stack>
    </LogItem>
  );
};

const StartLogItem = (props: LogItemProps<undefined>) => {
  const { type, author, created_datetime, isLoggedInUser, ...rest } = props;

  return (
    <LogItem type={type} created_datetime={created_datetime} {...rest}>
      <Text textStyle="xs" color="fg.muted">
        Conversation started
      </Text>
    </LogItem>
  );
};

const ReopenLogItem = (props: LogItemProps<undefined>) => {
  const { type, author, created_datetime, isLoggedInUser, ...rest } = props;

  return (
    <LogItem type={type} created_datetime={created_datetime} {...rest}>
      <Text textStyle="xs" color="fg.muted">
        Conversation reopened
      </Text>
    </LogItem>
  );
};

const LogItem = (props: LogItemContainerProps) => {
  const { type, children, created_datetime, ...rest } = props;

  return (
    <Stack
      gap={1}
      direction="row"
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      {children}
      <Text textStyle="xs" color="fg.muted">
        {dayjs(new Date(created_datetime)).format("DD MMM YYYY hh:mm a")}
      </Text>
    </Stack>
  );
};

const getLogType = (messageType: Message["type"]) => {
  const [, type, action] = messageType.split("/");
  if (!!action) {
    return `${type}-${action}`;
  }
  return type;
};
