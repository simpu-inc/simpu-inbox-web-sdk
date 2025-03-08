import { ChannelIntegration, InboxType } from "@/types";
import {
  QueryKeys,
  useGetInbox,
  useGetInboxes,
  useGetSupportedChannels,
} from "@/utils/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useSimpuProvider } from "../provider";

export const useAccountConnectOptions = (
  {
    inboxType = "personal",
  }: {
    inboxType?: InboxType;
  } = { inboxType: "personal" }
) => {
  const queryClient = useQueryClient();
  const { apiClient } = useSimpuProvider();
  const { data: userInboxes } = useGetInboxes(inboxType);

  const inboxName = `Inbox SDK: ${inboxType} inbox`;

  const sdkInbox = userInboxes?.inboxes.find(
    (i) => i.name.toLowerCase() === inboxName.toLowerCase()
  );

  const { data: inbox } = useGetInbox(sdkInbox?.uuid ?? "", {
    enabled: !!userInboxes?.inboxes.length,
  });
  const { data: { integrations: simpuSupportedChannels = [] } = {} } =
    useGetSupportedChannels({ page: 1, per_page: 25 });

  const channels = {} as { [key: string]: ChannelIntegration };

  for (const iterator of simpuSupportedChannels) {
    channels[iterator.name] = iterator;
  }

  const handleCreateInbox = async () => {
    try {
      await apiClient.inbox.inboxes.createInbox(inboxType, {
        color: "#ff0000",
        show_report: false,
        name: `Inbox SDK: ${inboxType} inbox`,
        description: `Inbox SDK: ${inboxType} inbox`,
      });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.getInboxes] });
    } catch (error) {
      return error;
    }
  };

  const getOauth2IntegrationUrl = async ({
    inbox_id,
    account_id,
    success_url,
    failure_url,
    integration_id,
  }: {
    inbox_id?: string;
    account_id?: string;
    success_url?: string;
    failure_url?: string;
    integration_id?: string;
  }) => {
    try {
      const { session_id } = await apiClient.inbox.integrations.addSession({
        inbox_id,
        account_id,
        failure_url,
        success_url,
        integration_id,
      });
      return apiClient.inbox.integrations.getOauth2IntegrationUrl(session_id);
    } catch (error: any) {
      throw error;
    }
  };

  return { inbox, channels, handleCreateInbox, getOauth2IntegrationUrl };
};
