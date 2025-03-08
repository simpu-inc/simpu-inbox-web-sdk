"use client";

import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Message } from "@/types";
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { LuChevronDown, LuDownload, LuFile } from "react-icons/lu";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "@/components/ui";
import dayjs from "dayjs";

const FileElement = ({ src }: { src: string }) => {
  return (
    <HStack gap={2}>
      <LuFile size={32} />
      <HStack align="center" gap={4} flex={1}>
        <Text textStyle="sm" fontWeight={500}>
          File
        </Text>
        <Link color="fg.inverted" href={src} download={src}>
          <LuDownload size={14} />
        </Link>
      </HStack>
    </HStack>
  );
};

const MediaElement = ({ src, type }: { src: string; type: string }) => {
  switch (type) {
    case "image":
      return (
        <Image src={src} alt="Chat image" objectFit="cover" width="100%" />
      );
    case "video":
      return (
        <AspectRatio ratio={16 / 9}>
          <video src={src} controls width="100%" height="100%" />
        </AspectRatio>
      );
    case "audio":
      return <audio src={src} controls style={{ width: "100%" }} />;
    case "file":
      return <FileElement src={src} />;
    default:
      return null;
  }
};

const urlRegex =
  /(?:(?:https?|ftp|file):\/\/)?(?:www\.)?(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(?:\/[^\s]*)?/i;

const parseText = (text: string, linkStyles?: string) => {
  const style = `font-weight: 400; text-decoration-line: underline;${linkStyles};`;

  return text?.replace(urlRegex, function (url) {
    return `<a target="_blank" href="${url}" style="${style}">${url}</a>`;
  });
};

export function TextWithLink({
  text,
  linkStyles,
  ...rest
}: {
  text: string;
  linkStyles?: string;
} & Omit<TextProps, "children">) {
  return (
    <Text
      dangerouslySetInnerHTML={{
        __html: parseText(text, linkStyles),
      }}
      {...rest}
    />
  );
}

export const ChatMessage = ({
  message,
  setMessageToReply,
}: {
  message: Message;
  setMessageToReply?(message: Message): void;
}) => {
  const { author, entity, by_account, created_datetime } = message;
  const attachments = entity?.attachments;
  const isUser = !!by_account;
  const hasAttachment = !!attachments && !!attachments.length;

  const bgColor = isUser ? "colorPalette.500" : "bg";
  const alignSelf = isUser ? "flex-end" : "flex-start";
  const textColor = useColorModeValue(
    isUser ? "fg.inverted" : "fg",
    isUser ? "fg" : "white"
  );

  const handleMenuItemSelect = ({ value }: { value: string }) => {
    if (value === "reply") {
      setMessageToReply?.(message);
    }

    if (value === "delete") {
    }
  };

  return (
    <Flex w="full" direction="column" alignItems={alignSelf}>
      <HStack px={16} align="flex-start" maxWidth="70%">
        {!isUser && (
          <Avatar
            src={author?.image_url}
            name={author?.name ?? author?.platform_nick}
          />
        )}
        <Stack
          px={3}
          py={2}
          gap={1}
          shadow="xs"
          bgColor={bgColor}
          borderRadius="lg"
          color={textColor}
          position="relative"
          _hover={{
            "& .menu-button-container": {
              opacity: 1,
              translateX: "0",
            },
          }}
        >
          <Box
            w="24px"
            h="27px"
            top="4px"
            right="4px"
            opacity={0}
            translateX="-10"
            position="absolute"
            className="menu-button-container"
            transform="opacity translateX 300ms ease-in-out"
          >
            <MenuRoot onSelect={handleMenuItemSelect}>
              <MenuTrigger asChild>
                <IconButton
                  w="16px"
                  h="16px"
                  size="xs"
                  top="2px"
                  right="0"
                  bg={bgColor}
                  variant="ghost"
                  color={textColor}
                  position="absolute"
                >
                  <LuChevronDown />
                </IconButton>
              </MenuTrigger>
              <MenuContent>
                <MenuItem cursor="pointer" value="reply">
                  Reply
                </MenuItem>
                {hasAttachment && attachments?.[0]?.type === "image" && (
                  <MenuItem cursor="pointer" value="download">
                    Download
                  </MenuItem>
                )}
                <MenuItem cursor="pointer" value="delete">
                  Delete
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          </Box>
          {entity?.content?.body && (
            <TextWithLink
              textStyle="sm"
              wordBreak="break-word"
              text={entity.content.body}
            />
          )}
          {hasAttachment && (
            <Grid
              templateColumns={
                attachments?.length > 1 ? "repeat(2, 1fr)" : "1fr"
              }
              gap={2}
            >
              {attachments?.map((item, index) => (
                <MediaElement
                  key={index}
                  type={item.type}
                  src={item?.data?.url}
                />
              ))}
            </Grid>
          )}
          <Flex
            mr={0}
            ml="4px"
            mb="-5px"
            mt="-5px"
            zIndex={10}
            position="relative"
            justify="flex-end"
          >
            <Flex
              h="15px"
              lineHeight="15px"
              whiteSpace="nowrap"
              alignItems="center"
              fontSize="xx-small"
            >
              <Text
                color={textColor}
                display="inline-block"
                verticalAlign="top"
              >
                {dayjs(new Date(created_datetime)).format("hh:mm")}
              </Text>
            </Flex>
          </Flex>
        </Stack>
      </HStack>
    </Flex>
  );
};
