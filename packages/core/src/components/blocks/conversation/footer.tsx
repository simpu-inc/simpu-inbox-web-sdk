"use client";

import React, {
  ChangeEvent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  FileUploadRoot,
  FileUploadRootProps,
  FileUploadTrigger,
} from "@/components/ui/file-button";
import { InboxMetaResponse, Message, Thread } from "simpu-api-sdk";
import { QueryKeys, useGetProfile, useGetThread } from "@/utils/queries";
import {
  Box,
  HStack,
  IconButton,
  Stack,
  Textarea,
  TextareaProps,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CgAttachment } from "react-icons/cg";
import { v4 as uuidV4 } from "uuid";
import { useSimpuProvider } from "../provider";
import { AttachmentItem } from "./attachment-item";
import { QuotedMessage } from "./quoted-message";

export interface ConversationFooterTextAreaProps
  extends Omit<TextareaProps, "onChange"> {
  onChange?(value: string): void;
}

export interface SendMessagePayload {
  body?: string;
  files?: File[];
  attachment_ids?: string[];
}

export const ConversationFooterTextArea = ({
  value: valueProp,
  onChange: onChangeProp,
  ...props
}: ConversationFooterTextAreaProps) => {
  const [value, setValue] = useState(valueProp ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";

      if (value) {
        const scrollHeight = textareaRef.current.scrollHeight;
        const newHeight = Math.min(Math.max(scrollHeight, 48), 200);
        textareaRef.current.style.height = `${newHeight}px`;
      }
    }
  }, [value]);

  useEffect(() => {
    if (!valueProp) {
      setValue("");
      onChangeProp?.("");
    }
  }, [valueProp]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    setValue(value);
    onChangeProp?.(value);
  };

  return (
    <Textarea
      rows={1}
      h="48px"
      minH="48px"
      maxH="200px"
      value={value}
      resize="none"
      overflow="hidden"
      ref={textareaRef}
      onChange={handleChange}
      {...props}
    />
  );
};

export const ConversationFooterAttachmentPicker = ({
  children,
  ...props
}: PropsWithChildren<FileUploadRootProps>) => {
  return (
    <FileUploadRoot {...props}>
      <FileUploadTrigger asChild>
        <IconButton size="sm" variant="ghost">
          {children}
        </IconButton>
      </FileUploadTrigger>
    </FileUploadRoot>
  );
};

export const ConversationFooter = ({
  thread_id,
  messageToReply,
  children,
  onErrorCallback,
  onSuccessCallback,
  onCancelMessageToReply,
  onAttachmentUploadError,
}: {
  thread_id: string;
  messageToReply?: Message;
  onSuccessCallback?(): void;
  onCancelMessageToReply?(): void;
  onErrorCallback?(error: any): void;
  onAttachmentUploadError?(error: any): void;
  children?(data: {
    thread?: Thread;
    handleInputChange?(value?: string): void;
  }): ReactNode;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [attachmentIds, setAttachmentIds] = useState<string[] | undefined>();

  const { data: thread } = useGetThread(thread_id);
  const { data: { profile } = {} } = useGetProfile();

  const queryClient = useQueryClient();
  const { apiClient } = useSimpuProvider();

  const defaultNewMessage = {
    thread_id,
    uuid: uuidV4(),
    by_account: true,
    content_id: uuidV4(),
    session_id: uuidV4(),
    author_type: "profile",
    type: "message/normal",
    entity: {
      status: "sent",
      uuid: uuidV4(),
      content: {
        body: message,
      },
      attachments: attachedFiles,
      created_datetime: new Date().toISOString(),
    },
    author: {
      type: "profile",
      uuid: profile?.user_id ?? "",
      image_url: profile?.image ?? "",
      name: `${profile?.first_name} ${profile?.last_name}`,
    },
    author_id: profile?.user_id ?? "",
    created_datetime: new Date().toISOString(),
  };

  const handleClearState = () => {
    setMessage("");
    setAttachedFiles([]);
    setAttachmentIds([]);
  };

  const { mutateAsync: mutateReplyMessage } = useMutation({
    mutationFn: ({ data }: { data: SendMessagePayload }) => {
      const { body, attachment_ids } = data;
      return apiClient.inbox.contents.reply(
        messageToReply?.uuid || thread?.draft?.message_id || "",
        {
          body: body ?? "",
          type: "message",
          attachments: attachment_ids,
        }
      );
    },
    onMutate: async () => {
      handleClearState();
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.getMessages, thread_id],
      });
      const previousMessages = queryClient.getQueryData([
        QueryKeys.getMessages,
        thread_id,
      ]);
      queryClient.setQueryData(
        [QueryKeys.getMessages, thread_id],
        (old: {
          pageParams: number[];
          pages: { meta: InboxMetaResponse; contents: Message[] }[];
        }) => ({
          ...old,
          pages: old.pages.map(
            (page: { meta: InboxMetaResponse; contents: Message[] }) => {
              if (page.meta.page === 1) {
                return {
                  ...page,
                  contents: [defaultNewMessage, ...page.contents],
                };
              }
              return page;
            }
          ),
        })
      );

      return { previousMessages };
    },
    onError: (error) => {
      onErrorCallback?.(error);
    },
    onSuccess: async () => {
      onSuccessCallback?.();
      onCancelMessageToReply?.();
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getMessages, thread_id],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getInboxThreads],
      });
    },
  });

  const { mutateAsync: mutateSendMessage } = useMutation({
    mutationFn: ({ data }: { data: SendMessagePayload }) => {
      return apiClient.inbox.contents.sendMessage(thread_id ?? "", {
        body: data.body ?? "",
        attachments: data?.attachment_ids,
      });
    },
    onMutate: async () => {
      handleClearState();

      await queryClient.cancelQueries({
        queryKey: [QueryKeys.getMessages, thread_id],
      });
      const previousMessages = queryClient.getQueryData([
        QueryKeys.getMessages,
        thread_id,
      ]);
      queryClient.setQueryData(
        [QueryKeys.getMessages, thread_id],
        (old: {
          pageParams: number[];
          pages: { meta: InboxMetaResponse; contents: Message[] }[];
        }) => {
          return {
            ...old,
            pages: old.pages.map(
              (page: { meta: InboxMetaResponse; contents: Message[] }) => {
                if (page.meta.page === 1) {
                  return {
                    ...page,
                    contents: [defaultNewMessage, ...page.contents],
                  };
                }
                return page;
              }
            ),
          };
        }
      );

      return { previousMessages };
    },
    onError: (error) => {
      onErrorCallback?.(error);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getMessages, thread_id],
      });
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.getInboxThreads],
      });
      onSuccessCallback?.();
    },
  });

  const handleSend = async () => {
    const data: SendMessagePayload = {
      body: message,
      attachment_ids: attachmentIds,
    };

    if (!!messageToReply) {
      return await mutateReplyMessage({
        data,
      });
    } else if (!!thread?.draft?.message_id) {
      return await mutateReplyMessage({
        data,
      });
    } else {
      return await mutateSendMessage({ data });
    }
  };

  const handleAttachedFileDelete = async (upload_id: string) => {
    try {
      await apiClient.inbox.accounts.deleteFile(upload_id);
      setAttachedFiles([]);
      setAttachmentIds(undefined);
    } catch (error) {
      onAttachmentUploadError?.(error);
    }
  };

  const handleAttachedFileUploadCompleted = (upload_ids: string[]) => {
    setAttachmentIds(upload_ids);
  };

  if (thread?.state === "resolved") {
    return null;
  }

  return (
    <Box w="full" bg="bg.muted" borderTopWidth={1}>
      <Box w="full" p={4}>
        {messageToReply && (
          <QuotedMessage
            message={messageToReply}
            onCancel={onCancelMessageToReply}
          />
        )}
        {!!attachedFiles.length && (
          <Stack direction="row" flexWrap="wrap" pb={2}>
            {attachedFiles.map((file: any, index: number) => (
              <AttachmentItem
                file={file}
                index={index}
                uploadType="message"
                setIsUploading={setIsUploading}
                credential_id={thread?.receiver_id}
                onDelete={handleAttachedFileDelete}
                onUpload={handleAttachedFileUploadCompleted}
                key={
                  !file.name
                    ? file.data.url
                    : `${file.name}-${file.size}-${file.type}`
                }
              />
            ))}
          </Stack>
        )}
        <HStack h="full" w="full" align="center">
          <ConversationFooterAttachmentPicker
            width="auto"
            maxFiles={1}
            maxFileSize={26214400}
            onFileAccept={({ files }) => setAttachedFiles(files)}
          >
            <CgAttachment size={20} />
          </ConversationFooterAttachmentPicker>
          <ConversationFooterTextArea
            size="sm"
            value={message}
            placeholder="Type message here"
            onChange={setMessage}
          />
          {children?.({ thread, handleInputChange: setMessage })}
          <Button
            size="sm"
            disabled={!message && isUploading && !attachmentIds?.length}
            onClick={handleSend}
          >
            Send
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};
