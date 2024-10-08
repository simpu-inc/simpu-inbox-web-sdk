"use client";

import React from "react";
import { Message } from "@/types";
import {
  Box,
  IconButton,
  LinkProps,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react";
import { LuFile, LuX } from "react-icons/lu";

export const QuotedMessage = (
  props: {
    isLink?: boolean;
    message?: Message;
    href?: LinkProps["href"];
    onCancel?(): void;
  } & StackProps
) => {
  const { href, isLink, message, onCancel, ...rest } = props;

  const { entity, author } = message ?? {};

  const { content, attachments } = entity ?? {};

  const hasAttachment = !!attachments?.length;

  const hoverStyle = isLink
    ? {
        _hover: {
          bg: "bg.subtle",
        },
      }
    : {};

  return (
    <Box
      bg="bg"
      mb={2}
      p="0.5rem 1rem"
      display="block"
      position="relative"
      borderLeftWidth={2}
      borderLeftColor="border"
      rounded="4px 1px 1px 4px"
      as={isLink ? "a" : "div"}
      //@ts-ignore
      href={isLink ? href : undefined}
      {...hoverStyle}
      {...rest}
    >
      <Text textStyle="xs" fontWeight="medium">
        {author?.name}
      </Text>
      <Text
        mt={1}
        maxW="720px"
        textStyle="xs"
        color="fg.muted"
        overflow="hidden"
        whiteSpace="pre-wrap"
        style={{ textOverflow: "ellipsis" }}
      >
        {content?.body}
      </Text>
      {hasAttachment && (
        <Stack mt={1} color="fg.muted" direction="row" alignItems="center">
          <LuFile />
          <Text textStyle="xs">Attachment</Text>
        </Stack>
      )}
      {onCancel && (
        <IconButton
          size="xs"
          top="0.2rem"
          right="0.2rem"
          variant="ghost"
          onClick={onCancel}
          position="absolute"
        >
          <LuX />
        </IconButton>
      )}
    </Box>
  );
};
