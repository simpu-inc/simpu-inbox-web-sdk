import { ChannelIntegration } from "@/types";
import {
  QueryKeys,
  useGetInbox,
  useGetInboxes,
  useGetSupportedChannels,
} from "@/utils/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useSimpuProvider } from "../provider";

export const useAccountConnectOptions = () => {
  const queryClient = useQueryClient();
  const { apiClient } = useSimpuProvider();
  const { data: personalInboxes } = useGetInboxes("personal");

  const { data: inbox } = useGetInbox(personalInboxes?.inboxes[0]?.uuid ?? "", {
    enabled: !!personalInboxes?.inboxes.length,
  });
  const { data: { integrations: simpuSupportedChannels = [] } = {} } =
    useGetSupportedChannels({ page: 1, per_page: 25 });

  const channels = {} as { [key: string]: ChannelIntegration };

  for (const iterator of simpuSupportedChannels) {
    channels[iterator.name] = iterator;
  }

  const handleCreateInbox = async () => {
    try {
      await apiClient.inbox.inboxes.createInbox("personal", {
        color: "#ff0000",
        show_report: false,
        name: "Personal Inbox",
        description: "Personal Inbox",
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
