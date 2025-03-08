import { AxiosRequestHeaders } from "axios";

export type CustomHeaders = AxiosRequestHeaders & {
  organisationID: string;
  "Simpu-Socket-ID": string;
};

export interface LoginPayload {
  /**
   * Email of the user
   */
  username: string;
  /**
   * Password of the user
   */
  password: string;
  /**
   * Option to always remember the user on the browser used to login
   */
  rememberMe?: boolean;
}

export interface SignupPayload {
  email: string;
  phone?: string;
  password: string;
  last_name: string;
  first_name: string;
  organisation_name?: string;
  team_id?: string;
  inviteToken?: string;
  link?: string;
  organisation_id?: string;
}

export interface User {
  id?: string;
  email?: string;
  company?: string;
  last_name?: string;
  first_name?: string;
  last_login?: string;
  account_type?: number;
  created_datetime: string;
  updated_datetime: string;
}

export interface Organization {
  id: string;
  name: string;
  size?: string;
  image?: string;
  industry?: string;
  sender_id?: string;
  bind_id?: string;
  verified_reseller?: boolean;
  reseller_organisation?: string;
  subaccount_permission: { [key: string]: string[] };
}

export interface UserProfile {
  id: string;
  image?: string;
  email?: string;
  user_id: string;
  last_name: string;
  first_name: string;
  phone?: string | null;
  organisation_id: string;
  created_datetime: string;
  updated_datetime: string;
  country_code?: string | null;
  page_access?: string[] | null;
  roles_page_access?: string[] | null;
  permissions?: string[] | null;
  roles_id?: string | null;
  onboard_role?: string;
  onboard_stage?: string;
  is_owner?: boolean;
  role?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    account_type: number;
    verified: boolean;
    last_login: string;
  };
  token: string;
  organisations: Organization[];
}

export interface DefaultInboxResponse<T> {
  data?: T;
  type: string;
  message: string;
  status?: number;
}

export interface InboxMetaResponse {
  page: number;
  count: number;
  page_size: number;
  page_count: number;
}

export interface ChannelGroup {
  uuid: string;
  name: string;
  image_url: string;
}

export interface ChannelIntegration {
  name: string;
  uuid: string;
  channel_id: string;
  channel_name: string;
}

export interface PotentialAccountsNonSessionResponse {
  id: string;
  user: {
    name: string;
    username: string;
    meta: {
      beta: boolean;
      latitude: string;
      longitude: string;
      iso_country: string;
      lata: string | null;
      region: string | null;
      capabilities: string[];
      locality: string | null;
      postal_code: string | null;
      rate_center: string | null;
      address_requirements: string;
      type: "toll_free" | "local" | "mobile";
    };
  };
}

export interface PotentialAccountsSessionResponse {
  id: string;
  user: {
    id: string;
    name: string;
    meta: {
      category: string;
      category_list: [
        {
          id: string;
          name: string;
        }
      ];
      emails: string[];
    };
    username: string;
    image_url: string;
  };
  status?: "active";
}

export type InboxType = "shared" | "personal";

export interface Inbox {
  uuid: string;
  name: string;
  color: string;
  type: InboxType;
  member_type: string;
  description: string;
  has_members: boolean;
  account_count: number;
  created_datetime: string;
  show_report: boolean | null;
  updated_datetime: string | null;
  accounts?: Account[];
  is_pinned?: boolean;
}

export interface InboxMember {
  name: string;
  type: string;
  uuid: string;
  user_id: string;
  image_url: string;
}

export interface Account {
  uuid: string;
  name: string | null;
  meta: {
    url?: string;
    stop_date?: string;
    push_echo?: boolean;
    allow_rating?: boolean;
    pull_history?: boolean;
    use_group_as_is?: boolean;
    url_verify_token?: string;
    allow_auto_response?: boolean;
    can_self_start_thread?: boolean;
  } | null;
  status: string;
  inbox_id: string;
  integration_id: string;
  updated_datetime: string | null;
  created_datetime: string;
  user: {
    name: string;
    uuid: string;
    image_url: string | null;
    platform_nick: string;
  };
  channel_id: string;
  channel_name: string;
  integration_name: string;
}

export type AccountType = "personal" | "shared" | "my-shared" | "me";

export interface Sender {
  uuid: string;
  channel_id: string;
  platform_id: string;
  contact_id?: string;
  name: string | null;
  channel_name: string;
  platform_nick: string;
  platform_name?: string;
  image_url: string | null;
  credential_id?: string;
  meta?: { [key: string]: any };
  contacts?: null;
  is_valid?: boolean;
  id?: number;
}

export interface Mention {
  uuid: string;
  name: string;
  type: "user" | "team" | "profile";
}

export interface Message {
  author: {
    name: string;
    type: string;
    uuid: string;
    image_url: string;
    platform_nick?: string;
  };
  entity: {
    has_message?: boolean;
    uuid: string;
    content: {
      body: string;
      subject?: string;
      body_html?: string;
      content_type?: string;
    };
    pid?: string;
    meta?: {
      type: string;
      deleted?: boolean;
    };
    status: string;
    quoted_id: string;
    attachments?: any[] | null;
    created_datetime: string;
    recipients?: {
      to?: Partial<Sender>[];
      cc?: Partial<Sender>[];
      bcc?: Partial<Sender>[];
      from?: Partial<Sender>[];
      reply_to?: Partial<Sender>[];
    };
    mentions?: Mention[];
  };
  quoted: {
    author: {
      image_url: string;
      contact_id: string;
      name: string;
      channel_name: string;
      platform_id: string;
      uuid: string;
      platform_nick: string;
      channel_id: string;
    };
    entity: {
      has_message?: boolean;
      uuid: string;
      content: {
        body: string;
        subject?: string;
        body_html?: string;
        content_type?: string;
      };
      pid?: string;
      meta?: {
        type: string;
      };
      status: string;
      quoted_id: string;
      attachments?: any[] | null;
      created_datetime: string;
      recipients?: {
        to?: Partial<Sender>[];
        cc?: Partial<Sender>[];
        bcc?: Partial<Sender>[];
        from?: Partial<Sender>[];
        reply_to?: Partial<Sender>[];
      };
      mentions?: Mention[];
    };
    uuid: string;
    type: string;
    sub_type: string;
    thread_id: string;
    session_id: string;
    by_account: any;
    after_sub_type: string | null;
    created_datetime: string;
    author_id: string;
    author_type: string;
    content_id: string;
    content_type: string;
  };
  uuid: string;
  type: string;
  sub_type: string;
  thread_id: string;
  session_id: string;
  by_account: boolean;
  after_sub_type: string | null;
  created_datetime: string;
  author_id: string;
  author_type: string;
  content_id: string;
  content_type: string;
}

export interface Tag {
  uuid: string;
  name: string;
  type: string;
  color: string;
  parent_id?: string | null;
  is_pinned?: boolean;
  created_datetime: string;
  description: string | null;
  updated_datetime: string | null;
  children_count: string;
  parent?: Tag;
}

export interface Thread {
  from: Sender[];
  assignees: {
    uuid: string;
    name: string;
    image_url: string;
    type: "profile" | "team";
  }[];
  tags: Tag[];
  participants: [];
  uuid: string;
  type: string;
  state: string;
  subject: string;
  inbox_id: string;
  is_read: boolean;
  sender_id: string;
  channel_id: string;
  has_draft: boolean;
  receiver_id: string;
  is_snoozed: boolean;
  is_assignee: boolean;
  channel_name: string;
  is_favorited: boolean;
  is_participant: boolean;
  integration_name: string;
  integration_id: string;
  created_datetime: string;
  updated_datetime: string;
  snooze?: { time: string } | null;
  draft?: {
    message_id?: string;
    recipients?: Partial<Record<"to" | "cc" | "bcc", string[]>>;
    content?: Partial<Record<"body" | "subject" | "contentType", string>>;
  } | null;
  inbox: Inbox;
  receiver: {
    uuid: string;
    name: string;
    meta: {
      allow_rating: boolean;
    };
    status: string;
    user_id: string;
    inbox_id: string;
    channel_id: string;
    channel_name: string;
    integration_id: string;
    integration_name: string;
    user: Sender;
  };
  sender?: Sender;
  last_message?: Message;
}

export interface ThreadRequestParams {
  q?: string;
  page?: number;
  per_page?: number;
  is_read?: boolean;
  has_draft?: boolean;
  is_snoozed?: boolean;
  is_favorited?: boolean;
  created_datetime?: { start?: string; end?: string };
  updated_datetime?: { start?: string; end?: string };
  assigned_datetime?: { start?: string; end?: string };
  resolved_datetime?: { start?: string; end?: string };
  agent_last_message_at?: { start?: string; end?: string };
  agent_first_message_at?: { start?: string; end?: string };
  customer_last_message_at?: { start?: string; end?: string };
  is_imported?: boolean;
  sort?: "newest" | "oldest";
  time_mode?: "created" | "updated";
  inbox_type?: "shared" | "personal";
  my_mode?: "open" | "assigned" | "closed" | "participant" | "assignee";
  subject?: string;
  state?: string[];
  uuid?: string[];
  tag?: string[];
  account?: string[];
  inbox?: string[];
  channel?: string[];
  integration?: string[];
  to?: string[];
  cc?: string[];
  bcc?: string[];
  from?: string[];
  reply_to?: string[];
  contact?: string[];
  entry?: string[];
  customer?: string[];
  customer_mention?: string[];
  team_assignee?: string[];
  team_mention?: string[];
  team_participant?: string[];
  profile_assignee?: string[];
  profile_mention?: string[];
  profile_participant?: string[];
  thread?: string[];
  resolver?: string[];
}

export interface Customer {
  uuid: string;
  name: string;
  contact_id: string;
  channel_id: string;
  channel_name: string;
  platform_nick: string;
  image_url: string | null;
}

export interface UserTying {
  typer_id: string;
  thread_id: string;
  user_type: "user" | "customer";
  message_type: "message" | "comment";
  typer_info: { name: string; id: string; image_url?: string | null };
}

export interface Sound {
  key: string;
  label: string;
  url: string;
}

export interface IconBaseProps extends React.SVGAttributes<SVGElement> {
  children?: React.ReactNode;
  size?: string | number;
  color?: string;
  title?: string;
}
export type IconType = (props: IconBaseProps) => JSX.Element;

export interface AssignLogEntity {
  name: string;
  uuid: string;
  color?: string;
  image_url?: string;
  type: "user" | "team" | "profile";
  owner: {
    name: string;
    uuid: string;
    color?: string;
    image_url?: string;
  };
}
