import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import qs from "qs";
import {
  Account,
  AccountType,
  AuthResponse,
  ChannelGroup,
  ChannelIntegration,
  Customer,
  CustomHeaders,
  Inbox,
  InboxMember,
  InboxMetaResponse,
  InboxType,
  LoginPayload,
  Message,
  Organization,
  PotentialAccountsNonSessionResponse,
  PotentialAccountsSessionResponse,
  SignupPayload,
  Sound,
  Thread,
  ThreadRequestParams,
  User,
  UserProfile,
} from "../types";

export class APIClient {
  private _headers: Partial<CustomHeaders> | undefined;

  instance: AxiosInstance;
  urls: { [key: string]: string };

  /**
   * Constructs an instance of APIClient.
   * @param urls - A mapping of API names to their URLs.
   * @param headers - Custom headers for API requests.
   */

  constructor(
    urls = {
      core: "",
      inbox: "",
    },
    headers: Partial<CustomHeaders> | undefined = undefined
  ) {
    this.urls = urls;
    this._headers = headers;
    this.instance = axios.create();
  }

  /**
   * Gets the current headers used for API requests.
   * @returns The current set of headers.
   */
  get headers(): Partial<CustomHeaders> | undefined {
    return this._headers;
  }

  /**
   * Sets custom headers for API requests.
   * @param headers - The headers to be set.
   */
  set headers(headers) {
    this._headers = headers;
  }

  /**
   * Internal method to make API requests using Axios.
   * @param baseconfig - Axios request configuration.
   * @returns The response data from the API request.
   */
  async client(baseconfig: AxiosRequestConfig) {
    const { headers, ...rest } = baseconfig;
    const result = await this.instance.request({
      //@ts-ignore
      headers: {
        ...this._headers,
        ...headers,
      },
      ...rest,
    });
    const { data } = result;
    return data;
  }

  /**
   * Authentication-related methods.
   */
  auth = {
    /**
     * Performs a login operation.
     * @param values - The login credentials.
     * @returns The authentication token and user details.
     */
    login: async (values: LoginPayload): Promise<AuthResponse> => {
      const baseURL = this.urls["core"];
      const response = await this.client({
        baseURL,
        data: values,
        method: "POST",
        url: "/auth/login",
      });
      const { token, auth: user, organisations } = response.data;
      return { token, user, organisations };
    },
    /**
     * Performs a signup operation.
     * @param values - The signup credentials.
     * @returns The authentication token and user details.
     */
    register: async (values: SignupPayload): Promise<AuthResponse> => {
      const baseURL = this.urls["core"];
      const response = await this.client({
        baseURL,
        data: values,
        method: "POST",
        url: "/auth/create",
      });
      const { token, auth: user, organisations } = response.data;
      return { token, user, organisations };
    },
  };

  /**
   * Inbox-related methods
   */
  inbox = {
    accounts: {
      getAccounts: async (
        type: AccountType,
        params?: {
          inbox_id: string[];
          channel_id: string[];
          integration_id: string[];
        }
      ): Promise<{ meta: InboxMetaResponse; accounts: Account[] }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params,
          url: `/accounts/list/${type}`,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "indices" });
          },
        });
        return data;
      },
      getAccount: async (account_id: string): Promise<Account> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}`,
        });
        return data.account;
      },
      disconnectAccount: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const response = await this.client({
          baseURL,
          method: "DELETE",
          url: `/accounts/${account_id}`,
        });
        return response;
      },
      refreshAccount: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/accounts/${account_id}/refresh`,
        });
        return data;
      },
      updateAccount: async (
        account_id: string,
        payload: { [key: string]: any }
      ): Promise<{ message: string }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "PATCH",
          url: `/accounts/${account_id}`,
        });
        return data;
      },
      moveAccountToInbox: async (
        account_id: string,
        inbox_id: string
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/acccounts/${account_id}/move/${inbox_id}`,
        });
        return data;
      },
      regenerateAccountSecretKey: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/accounts/${account_id}/regenerate-secret-key`,
        });
        return data;
      },
      accountInitializationConfig: async (
        account_id: string,
        session_id: string
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}/session/${session_id}`,
        });
        return data;
      },
      getAccountSettings: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}/settings`,
        });
        return data;
      },
      getAccountApps: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}/apps`,
        });
        return data;
      },
      upsertAccountCustomer: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/accounts/${account_id}/customers`,
        });
        return data;
      },
      getAccountCustomer: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}/customers`,
        });
        return data;
      },
      authenticateAccountWebsocket: async (
        account_id: string
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/accounts/${account_id}/websockets`,
        });
        return data;
      },
      authorizeAccountWebsocket: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/accounts/${account_id}/websocket/channel`,
        });
        return data;
      },
      getAccountWebsocketChannels: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}/websockets`,
        });
        return data;
      },
      getAccountSessions: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}/sessions`,
        });
        return data;
      },
      getAccountActiveSession: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}/sessions/latest`,
        });
        return data;
      },
      getAccountSession: async (session_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/session/${session_id}`,
        });
        return data;
      },
      updateNotificationStatus: async (session_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "PATCH",
          url: `/accounts/${session_id}/notifications`,
        });
        return data;
      },
      sendTypingEvent: async (session_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/accounts/${session_id}/typing`,
        });
        return data;
      },
      uploadFile: async (
        account_id: string,
        payload: FormData,
        params?: AxiosRequestConfig
      ): Promise<{
        attachment_id: string;
      }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/accounts/${account_id}/upload`,
          ...params,
        });
        return data;
      },
      deleteFile: async (upload_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "DELETE",
          url: `/accounts/upload/${upload_id}`,
        });
        return data;
      },
      getUnreadCount: async (
        account_id: string
      ): Promise<{ count: number }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}/notifications`,
        });
        return data;
      },
      getMessages: async (options: {
        params: { page: number; per_page: number };
        path_variables: { account_id: string; session_id: string };
      }): Promise<{ meta: InboxMetaResponse; messages: Message[] }> => {
        const baseURL = this.urls["inbox"];
        const { path_variables, params } = options;
        const { account_id, session_id } = path_variables;
        const { data } = await this.client({
          params,
          baseURL,
          url: `/accounts/${account_id}/messages/${session_id}`,
        });
        return data;
      },
      sendMessage: async (
        account_id: string,
        payload: { body: string; attachments?: string[] }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const {} = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/accounts/${account_id}/messages`,
        });
      },
      resendMessage: async (
        message_id: string,
        payload: { body: string; attachments?: string[] }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/accounts/messages/${message_id}`,
        });
        return data;
      },
      importMessageHistory: async (account_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/accounts/${account_id}/messages/history`,
        });
        return data;
      },
      getImportMessageHistoryStatus: async (
        account_id: string
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/accounts/${account_id}/messages/history`,
        });
        return data;
      },
    },
    auth: {
      getProfile: async () => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/auth/settings`,
        });
        return data.profiles;
      },
      updateProfile: async (payload: Record<string, any>) => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          data: payload,
          url: `/auth/settings`,
        });
        return data;
      },
      authenticateWebsocket: async (payload: {
        socket_id: string;
      }): Promise<{
        auth: string;
        user_data: string;
      }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/auth/websocket`,
        });
        return data;
      },
      authorizeWebsocketChannel: async (payload: {
        channel_name: string;
        socket_id: string;
      }): Promise<{
        auth: string;
        channel_data: string;
      }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/auth/websocket/channel`,
        });
        return data;
      },
      profileTeamDeletion: async (
        type: "team" | "profile",
        id: string
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "DELETE",
          url: `/auth/${type}/${id}`,
        });
        return data;
      },
    },
    channels: {
      getChannelGroups: async (params?: {
        page?: number;
        per_page?: number;
      }): Promise<{
        meta: InboxMetaResponse;
        channels: ChannelGroup[];
      }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params,
          url: `/channels`,
        });
        return data;
      },
    },
    contents: {
      startConversation: async (
        credential_id: string,
        payload: {
          to: string[];
          body: string;
          cc?: string[];
          html?: string;
          bcc?: string[];
          subject?: string;
          reply_to?: string;
          attachments?: string[];
          mentions?: {
            id: string;
            type: string;
            name: string;
          }[];
        }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/contents/start/${credential_id}`,
        });
        return data;
      },
      sendMessage: async (
        thread_id: string,
        payload: {
          body?: string;
          mentions?: string[];
          attachments?: string[];
        }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/contents/message/${thread_id}`,
        });
        return data;
      },
      sendComment: async (
        thread_id: string,
        payload: {
          body?: string;
          mentions?: string[];
          attachments?: string[];
        }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/contents/comment/${thread_id}`,
        });
        return data;
      },
      reply: async (
        content_id: string,
        payload: {
          type: string;
          body?: string;
          mentions?: string[];
          attachments?: string[];
        }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/contents/${content_id}/reply`,
        });
        return data;
      },
      forward: async (
        content_id: string,
        payload: {
          html: string;
          body: string;
          to: string[];
          cc?: string[];
          bcc?: string[];
          reply_to: string;
          attachments?: string[];
        }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/contents/${content_id}/forward`,
        });
        return data;
      },
      retry: async (content_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/contents/${content_id}/retry`,
        });
        return data;
      },
      getContents: async (
        type: "thread" | "session",
        id: string,
        params?: {
          page?: number;
          per_page?: number;
          type: "all" | "log" | "comm" | "comment" | "message";
        }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          params,
          baseURL,
          url: `/contents/${type}/${id}`,
        });
        return data;
      },
      getContent: async (content_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/contents/${content_id}`,
        });
        return data;
      },
      getMessageContent: async (content_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/contents/${content_id}/message-content`,
        });
        return data;
      },
      deleteContent: async (ids: string[]): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params: { ids },
          method: "DELETE",
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "indices" });
          },
        });
        return data;
      },
      getMessageAttachment: async (
        attachment_id: string,
        params?: { token?: string; organisation_id?: string }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          params,
          baseURL,
          url: `/contents/attachment/${attachment_id}`,
        });
        return data;
      },
    },
    customers: {
      getCustomers: async (params?: {
        q?: string;
        page?: number;
        per_page?: number;
        channel_id?: string;
      }): Promise<{
        meta: {
          page: number;
          has_next: boolean;
          page_size: number;
        };
        customers: Customer[];
      }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params,
          url: `/customers`,
        });
        return data;
      },
      getCustomer: async (customer_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/customers/${customer_id}`,
        });
        return data;
      },
      renewCustomer: async (
        customer_id: string,
        account_id: string
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/customers/${customer_id}/account/${account_id}`,
        });
        return data;
      },
    },
    inboxes: {
      getInboxes: async (
        type: InboxType,
        params?: {
          q?: string;
          members?: boolean;
          accounts?: boolean;
          is_pinned?: boolean;
          show_report?: boolean;
        }
      ): Promise<{ meta: InboxMetaResponse; inboxes: Inbox[] }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          params,
          baseURL,
          url: `/inboxes/list/${type}`,
        });
        return data;
      },
      getInbox: async (inbox_id: string): Promise<Inbox> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/inboxes/${inbox_id}`,
        });
        return data.inbox;
      },
      createInbox: async (
        type: InboxType,
        payload: Pick<
          Inbox,
          "name" | "color" | "description" | "show_report"
        > & { add_as_member?: boolean }
      ) => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/inboxes/${type}`,
        });
        return data.inbox;
      },
      updateInbox: async (inbox_id: string, payload: Partial<Inbox>) => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "PATCH",
          url: `/inboxes/${inbox_id}`,
        });
        return data.inbox;
      },
      deleteInbox: async (inbox_ids: string[]): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/inboxes`,
          method: "DELETE",
          params: { ids: inbox_ids },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "indices" });
          },
        });
        return data;
      },
      pinInbox: async (inbox_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/inboxes/${inbox_id}/pin`,
        });
        return data;
      },
      unPinInbox: async (inbox_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "DELETE",
          url: `/inboxes/${inbox_id}/pin`,
        });
        return data;
      },
      getInboxMembers: async (
        inbox_id: string
      ): Promise<{ members: InboxMember[]; member_type: string }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/inboxes/${inbox_id}/members`,
        });
        return data;
      },
      addInboxMembers: async (
        inbox_id: string,
        payload: {
          type: string;
          ids: string[];
          is_replaced?: boolean;
        }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/inboxes/${inbox_id}/members`,
        });
        return data;
      },
      deleteInboxMembers: async (
        inbox_id: string,
        member_ids: string[]
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "DELETE",
          params: { ids: member_ids },
          url: `/inboxes/${inbox_id}/members`,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "indices" });
          },
        });
        return data;
      },
      getInboxAccounts: async (inbox_id: string): Promise<Account[]> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/inboxes/${inbox_id}/accounts`,
        });
        return data.accounts;
      },
    },
    integrations: {
      addSession: async (payload: {
        inbox_id?: string;
        account_id?: string;
        success_url?: string;
        failure_url?: string;
        integration_id?: string;
      }): Promise<{ session_id: string }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/integrations/session`,
        });
        return data;
      },
      removeSession: async (session_id: string): Promise<void> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "DELETE",
          url: `/integrations/session/${session_id}`,
        });
        return data;
      },
      generateQRCode: async (session_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/integrations/session/${session_id}/qr-code`,
        });
        return data;
      },
      cancelQRCodeGeneration: async (session_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "DELETE",
          url: `/integrations/session/${session_id}/qr-code`,
        });
        return data;
      },
      getIntegrations: async (params?: {
        q?: string;
        page?: number;
        per_page?: number;
        channel_id?: string[];
      }): Promise<{
        meta: InboxMetaResponse;
        integrations: ChannelIntegration[];
      }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          params,
          baseURL,
          url: `/integrations`,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "indices" });
          },
        });
        return data;
      },
      getOauth2IntegrationUrl: (session_id: string): string => {
        const baseURL = this.urls["inbox"];

        return `${baseURL}/integrations/session/${session_id}/oauth2`;
      },
      getIntegrationSupportedCountries: async (
        integration_id: string
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/integrations/${integration_id}/supported-countries`,
        });
        return data;
      },
      getPotentialAccountsNonSession: async (
        integration_id: string,
        params?: {
          contains?: string;
          in_region?: string;
          area_code?: string;
          country_code?: string;
          phone_types?: "toll_free" | "local" | "mobile";
        }
      ): Promise<PotentialAccountsNonSessionResponse[]> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          params,
          baseURL,
          url: `/integrations/${integration_id}/accounts`,
        });
        return data.list;
      },
      getPotentialAccountsSession: async (
        session_id: string
      ): Promise<PotentialAccountsSessionResponse[]> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/integrations/session/${session_id}/accounts`,
        });
        return data.list;
      },
      connectAccountInbox: async (
        inbox_id: string,
        integration_id: string,
        payload: Record<string, any>
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/integrations/${integration_id}/accounts/inbox/${inbox_id}`,
        });
        return data;
      },
      connectAccountSession: async (session_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/integrations/session/${session_id}/accounts`,
        });
        return data;
      },
    },
    threads: {
      getSize: async (): Promise<number> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/threads/size`,
        });
        return data.size;
      },
      getCounts: async (): Promise<{
        closed: number;
        drafts: number;
        queued: number;
        assigned: number;
        mentioned: number;
        inboxes: {
          [key: string]: number;
        };
      }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/threads/count`,
        });
        return data.count;
      },
      getPersonalThreads: async (
        filter: "favorited" | "snoozed" | "all",
        params?: ThreadRequestParams
      ): Promise<{ meta: InboxMetaResponse; threads: Thread[] }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params,
          url: `/threads/personal/${filter}`,
        });
        return data;
      },
      getMyThreads: async (
        filter: "open" | "assigned" | "mentions" | "closed" | "draft",
        params?: ThreadRequestParams
      ): Promise<{ meta: InboxMetaResponse; threads: Thread[] }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params,
          url: `/threads/me/${filter}`,
        });
        return data;
      },
      getInboxThreads: async (
        inbox_id: string,
        filter: "open" | "assigned" | "closed",
        params?: ThreadRequestParams
      ): Promise<{ meta: InboxMetaResponse; threads: Thread[] }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params,
          url: `/threads/inbox/${inbox_id}/${filter}`,
        });
        return data;
      },
      getTagThreads: async (
        tag_id: string,
        filter: "open" | "assigned" | "closed",
        params?: ThreadRequestParams
      ): Promise<{ meta: InboxMetaResponse; threads: Thread[] }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params,
          url: `/threads/tag/${tag_id}/${filter}`,
        });
        return data;
      },
      getTypeThreads: async (
        type: "contact" | "entry" | "customer",
        id: string,
        params?: ThreadRequestParams
      ): Promise<{ meta: InboxMetaResponse; threads: Thread[] }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params,
          url: `/threads/${type}/${id}`,
        });
        return data;
      },
      getThreads: async (
        params?: ThreadRequestParams
      ): Promise<{ meta: InboxMetaResponse; threads: Thread[] }> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          params,
          url: `/threads`,
        });
        return data;
      },
      getThread: async (thread_id: string): Promise<Thread> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/threads/${thread_id}`,
        });
        return data.thread;
      },
      getLatestMessage: async (thread_id: string): Promise<Message> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/threads/${thread_id}/last-message`,
        });
        return data.last_message;
      },
      resolveThreads: async (payload: {
        note?: string;
        tags?: string[];
        threads: string[];
        requestRating?: boolean;
      }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/threads/resolve`,
        });
        return data;
      },
      undoResolveThreads: async (payload: {
        threads: string[];
      }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/threads/undo-resolve`,
        });
        return data;
      },
      reopenThreads: async (payload: { threads: string[] }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/threads/reopen`,
        });
        return data;
      },
      bulkUndoResolve: async (payload: {
        thread_ids: string[];
        users: { type: string; id: string }[];
      }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "PATCH",
          url: `/threads/bulk-undo-resolve`,
        });
        return data;
      },
      bulkReopen: async (payload: { thread_ids: string[] }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "PATCH",
          url: `/threads/bulk-reopen`,
        });
        return data;
      },
      addAssignees: async (payload: {
        threads: string[];
        teams?: string[];
        profile?: string[];
      }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/threads/assign`,
        });
        return data;
      },
      removeAssignees: async (payload: {
        threads: string[];
        teams?: string[];
        profile?: string[];
      }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "DELETE",
          url: `/threads/assign`,
        });
        return data;
      },
      addParticipants: async (payload: {
        threads: string[];
        teams?: string[];
        profile?: string[];
      }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/threads/participant`,
        });
        return data;
      },
      removeParticipants: async (payload: {
        threads: string[];
        teams?: string[];
        profile?: string[];
      }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "DELETE",
          url: `/threads/participant`,
        });
        return data;
      },
      addTags: async (payload: {
        tags: string[];
        global?: boolean;
        threads: string[];
      }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/threads/tag`,
        });
        return data;
      },
      removeTags: async (payload: {
        tags: string[];
        threads: string[];
      }): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "DELETE",
          url: `/threads/tag`,
        });
        return data;
      },
      favorite: async (thread_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/threads/${thread_id}/favorite`,
        });
        return data;
      },
      unfavorite: async (thread_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "DELETE",
          url: `/threads/${thread_id}/favorite`,
        });
        return data;
      },
      addDraft: async (
        thread_id: string,
        payload: {
          body: string;
          subject?: string;
          message_id: string;
          content_type?: string;
          cc?: string[];
          bcc?: string[];
          recipients?: { [key: string]: string[] };
        }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          data: payload,
          url: `/threads/${thread_id}/draft`,
        });
        return data;
      },
      removeDraft: async (thread_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "DELETE",
          url: `/threads/${thread_id}/draft`,
        });
        return data;
      },
      snooze: async (
        thread_id: string,
        payload: { time: number }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          data: payload,
          url: `/threads/${thread_id}/snooze`,
        });
        return data;
      },
      unsnooze: async (thread_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "DELETE",
          url: `/threads/${thread_id}/snooze`,
        });
        return data;
      },
      move: async (thread_id: string, inbox_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          method: "POST",
          url: `/threads/${thread_id}/move/${inbox_id}`,
        });
        return data;
      },
      sendTypingEvent: async (
        thread_id: string,
        payload: { type: string }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "POST",
          url: `/threads/${thread_id}/typing`,
        });
        return data;
      },
      changeReadStatus: async (
        thread_id: string,
        payload: { event: "read" | "unread" }
      ): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          data: payload,
          method: "PATCH",
          url: `/threads/${thread_id}/notifications`,
        });
        return data;
      },
    },
    thread_sessions: {
      getSessions: async (params?: ThreadRequestParams): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          params,
          baseURL,
          url: `/sessions`,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "indices" });
          },
        });
        return data;
      },
      getSession: async (session_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/sessions/${session_id}`,
        });
        return data;
      },
      getLastMessage: async (session_id: string): Promise<any> => {
        const baseURL = this.urls["inbox"];
        const { data } = await this.client({
          baseURL,
          url: `/sessions/${session_id}/last-message`,
        });
        return data;
      },
    },
  };

  /**
   * Notification-related methods.
   */
  notification = {
    /**
     * Get notification sounds.
     * @returns
     */
    getSounds: async (): Promise<Sound[]> => {
      const baseURL = this.urls["core"];
      const { data } = await this.client({
        baseURL,
        url: "/notification/settings/sounds",
        method: "GET",
      });
      return data;
    },
  };

  /**
   * Organisation-related methods.
   */
  organisation = {
    /**
     * Get an organisation's details.
     * @returns An organisation's details
     */
    getOrganisation: async (): Promise<Organization> => {
      const baseURL = this.urls["core"];
      const { data } = await this.client({
        baseURL,
        url: `/organisations/view`,
      });
      return data.organisation;
    },
    /**
     * Create an organisation.
     * @param payload Object with organization name.
     * @returns An organisation's details
     */
    createOrganisation: async (payload: {
      name: string;
    }): Promise<Organization> => {
      const baseURL = this.urls["core"];
      const { data } = await this.client({
        baseURL,
        data: payload,
        method: "POST",
        url: "/organisations/create",
      });

      return data.organisation;
    },
    /**
     * Update an organisation.
     * @param data Object with organization name.
     * @returns An organisation's details
     */
    updateOrganisation: async (payload: {
      name: string;
    }): Promise<Organization> => {
      const baseURL = this.urls["core"];
      const { data } = await this.client({
        baseURL,
        data: payload,
        method: "PATCH",
        url: "/organisations/update",
      });

      return data.organisation;
    },

    uploadImage: async (payload: FormData) => {
      const baseURL = this.urls["core"];
      const { data } = await this.client({
        baseURL,
        data: payload,
        method: "POST",
        url: "/file/upload/image",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
  };

  /**
   * User profile-related methods.
   */
  profile = {
    /**
     * Get a user's profile details.
     * @returns User's profile detils
     */
    getProfile: async (): Promise<{
      user: User;
      profile: UserProfile;
    }> => {
      const baseURL = this.urls["core"];
      const response = await this.client({
        baseURL,
        url: `/auth/view`,
      });

      return response.data;
    },
    /**
     * Update a user's profile details.
     * @param values
     * @returns User's profile detils
     */
    updateProfile: async (
      values: Partial<Pick<UserProfile, "first_name" | "last_name">> & {
        user_id: User["id"];
        onboard_role?: string;
        purpose?: "personal" | "business";
      }
    ): Promise<UserProfile> => {
      const baseURL = this.urls["core"];
      const response = await this.client({
        baseURL,
        data: values,
        method: "PATCH",
        url: "/profile/save",
      });
      return response.data.profile;
    },
    /**
     * Save a user's profile image.
     * @param data Form data with a file field.
     * @returns
     */
    saveUserProfileImage: async (data: FormData): Promise<UserProfile> => {
      const baseURL = this.urls["core"];
      const response = await this.client({
        data,
        baseURL,
        method: "POST",
        url: `/profile/save_image`,
      });
      return response.data.profile;
    },
  };
}
