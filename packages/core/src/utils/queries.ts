import { useSimpuProvider } from "@/components/blocks/provider/simpu-provider";
import {
  Account,
  ChannelIntegration,
  Inbox,
  InboxMetaResponse,
  InboxType,
  Sound,
  Thread,
  ThreadRequestParams,
  User,
  UserProfile,
} from "@/types";
import {
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

type QueryOptions<T> = Omit<UseQueryOptions<T>, "queryFn" | "queryKey">;

export enum QueryKeys {
  "getInbox" = "simpu/get-inbox",
  "getSounds" = "simpu/get-sounds",
  "getThread" = "simpu/get-thread",
  "getProfile" = "simpu/get-profile",
  "getInboxes" = "simpu/get-inboxes",
  "getMessages" = "simpu/get-messages",
  "getContacts" = "simpu/get-contacts",
  "getThreadDraft" = "simpu/get-thread-draft",
  "getUnreadCounts" = "simpu/get-unread-counts",
  "getInboxThreads" = "simpu/get-inbox-threads",
  "uploadAttachment" = "simpu/upload-attachment",
  "supportedChannels" = "simpu/supported-channels",
  "markThreadAsRead" = "simpu/mark-thread-as-read",
  "getInboxAccounts" = "simpu/get-inboxes-accounts",
}

export const useGetProfile = (
  options?: QueryOptions<{
    user: User;
    profile: UserProfile;
  }>
) => {
  const { apiClient } = useSimpuProvider();

  return useQuery({
    queryKey: [QueryKeys.getProfile],
    queryFn: apiClient.profile.getProfile,
    ...options,
  });
};

export const useGetInboxes = (
  type: InboxType,
  params?: {
    q?: string;
    members?: boolean;
    accounts?: boolean;
    is_pinned?: boolean;
    show_report?: boolean;
  },
  options?: QueryOptions<{
    inboxes: Inbox[];
    meta: InboxMetaResponse;
  }>
) => {
  const { apiClient } = useSimpuProvider();

  return useQuery({
    queryKey: [QueryKeys.getInboxes, type],
    queryFn: () => apiClient.inbox.inboxes.getInboxes(type, params),
    ...options,
  });
};

export const useGetInbox = (
  inbox_id: string,
  options?: QueryOptions<Inbox>
) => {
  const { apiClient } = useSimpuProvider();

  return useQuery({
    queryKey: [QueryKeys.getInbox, inbox_id],
    queryFn: () => apiClient.inbox.inboxes.getInbox(inbox_id),
    ...options,
  });
};

export const useGetInboxAccounts = (
  inbox_id: string,
  options?: QueryOptions<Account[]>
) => {
  const { apiClient } = useSimpuProvider();

  return useQuery({
    queryKey: [QueryKeys.getInboxAccounts, inbox_id],
    queryFn: () => apiClient.inbox.inboxes.getInboxAccounts(inbox_id),
    ...options,
  });
};

export const useGetSupportedChannels = (
  params?: {
    q?: string | undefined;
    page?: number | undefined;
    per_page?: number | undefined;
    channel_id?: string[] | undefined;
  },
  options?: QueryOptions<{
    meta: InboxMetaResponse;
    integrations: ChannelIntegration[];
  }>
) => {
  const { apiClient } = useSimpuProvider();

  return useQuery<{
    meta: InboxMetaResponse;
    integrations: ChannelIntegration[];
  }>({
    queryKey: [QueryKeys.supportedChannels],
    queryFn: () => apiClient.inbox.integrations.getIntegrations(params),
    ...options,
  });
};

export const useGetThreads = (payload: {
  filter: "all" | "favorited" | "snoozed";
  params?: ThreadRequestParams;
}) => {
  const { filter, params } = payload;
  const { apiClient } = useSimpuProvider();

  const fetchThreads = async ({ pageParam = 1, queryKey }: any) => {
    const [_, filter] = queryKey;

    return apiClient.inbox.threads.getPersonalThreads(filter, {
      ...params,
      page: pageParam ?? 1,
      per_page: params?.per_page ?? 25,
    });
  };

  return useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.meta?.page < lastPage.meta.page_count
        ? lastPage.meta.page + 1
        : undefined;
    },
    queryKey: [
      QueryKeys.getInboxThreads,
      filter,
      ...Object.entries(params ?? {}),
    ],
    queryFn: fetchThreads,
  });
};

export const useGetThread = (
  thread_id: string,
  options?: QueryOptions<Thread>
) => {
  const { apiClient } = useSimpuProvider();

  return useQuery({
    queryKey: [QueryKeys.getThread, thread_id],
    queryFn: () => apiClient.inbox.threads.getThread(thread_id),
    ...options,
  });
};

export const useMarkChatAsRead = (thread_id: string, is_read: boolean) => {
  const { apiClient } = useSimpuProvider();

  return useQuery({
    queryKey: [QueryKeys.markThreadAsRead, thread_id],
    queryFn: () =>
      apiClient.inbox.threads.changeReadStatus(thread_id, {
        event: "read",
      }),
    enabled: !!thread_id && !is_read,
  });
};

export const useGetChatDraft = (message_id: string) => {
  const { apiClient } = useSimpuProvider();

  return useQuery({
    queryKey: [QueryKeys.getThreadDraft, message_id],
    queryFn: () => apiClient.inbox.contents.getContent(message_id ?? ""),
    enabled: !!message_id,
  });
};

export const useGetMessages = (payload: {
  thread_id: string;
  type: "thread" | "session";
  params?: {
    page?: number;
    per_page?: number;
    type: "all" | "log" | "comm" | "comment" | "message";
  };
}) => {
  const { type, thread_id, params } = payload;
  const { apiClient } = useSimpuProvider();

  const fetchMessages = async ({ pageParam = 1, queryKey }: any) => {
    const [_, thread_id] = queryKey;

    return apiClient.inbox.contents.getContents(type, thread_id, {
      page: pageParam ?? 1,
      per_page: params?.per_page,
      type: params?.type ?? "all",
    });
  };

  return useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.meta?.page < lastPage.meta.page_count
        ? lastPage.meta.page + 1
        : undefined;
    },
    enabled: !!thread_id,
    queryKey: [QueryKeys.getMessages, thread_id],
    queryFn: fetchMessages,
  });
};

export const useGetContacts = (payload: {
  q?: string;
  per_page?: number;
  channel_id?: string;
}) => {
  const { channel_id, q, per_page } = payload;
  const { apiClient } = useSimpuProvider();

  const fetchContacts = ({ pageParam = 1, queryKey }: any) => {
    const [, searchQuery, channel_id] = queryKey;
    return apiClient.inbox.customers.getCustomers({
      channel_id,
      page: pageParam ?? 1,
      per_page: per_page ?? 25,
      q: !!searchQuery ? searchQuery : undefined,
    });
  };

  return useInfiniteQuery({
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.meta?.has_next ? lastPage.meta.page + 1 : undefined;
    },
    queryFn: fetchContacts,
    queryKey: [QueryKeys.getContacts, q, channel_id],
  });
};

export const useGetNotificationSounds = (
  options?: UseQueryOptions<Sound[]>
) => {
  const { apiClient } = useSimpuProvider();
  return useQuery<Sound[]>({
    queryKey: [QueryKeys.getSounds],
    queryFn: apiClient.notification.getSounds,
    staleTime: Infinity,
    ...options,
  });
};
