"use client";

import { Provider } from "@/components/ui/provider";
import { UserTying } from "@/types";
import { constants } from "@/utils/constants";
import { initializePusher } from "@/utils/pusher";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { SocketProvider } from "./socket-provider";
import { Box, BoxProps } from "@chakra-ui/react";
import { APIClient } from "simpu-api-sdk";

const SimpuContext = createContext<SimpuContextType | null>(null);

export interface SimpuContextType {
  accessToken: string;
  apiClient: APIClient;
  shouldPopSound: boolean;
  userTypingData?: UserTying;
  onNewWebsocketEvent(): void;
  onUserIsTypingEvent(typingData: UserTying): void;
}

export interface SimpuProviderProps extends PropsWithChildren {
  accessToken: string;
  organisationID: string;
  options?: {
    coreApiUrl?: string;
    conversationApiUrl?: string;
    env?: "development" | "production";
  };
  colorPalette?: BoxProps["colorPalette"];
}

export const useSimpuProvider = () => {
  const value = useContext(SimpuContext);

  if (!value) {
    throw new Error("useSimpuProvider must be used within the SimpuProvider");
  }

  return value;
};

export const SimpuProvider: React.FC<SimpuProviderProps> = (props) => {
  const {
    children,
    accessToken,
    organisationID,
    colorPalette = "gray",
    options: {
      env = "development",
      coreApiUrl = constants.CORE_API_URL,
      conversationApiUrl = constants.CONVERSATION_API_URL,
    } = {},
  } = props;

  console.log({ env, coreApiUrl, conversationApiUrl });

  const [queryClient] = useState(() => new QueryClient());
  const [shouldPopSound, setShouldPopSound] = useState(false);
  const [userTypingData, setUserTypingData] = useState<UserTying | undefined>();

  const apiClient = new APIClient(
    {
      ai: coreApiUrl,
      apps: coreApiUrl,
      core: coreApiUrl,
      graph: coreApiUrl,
      events: coreApiUrl,
      report: coreApiUrl,
      payment: coreApiUrl,
      notification: coreApiUrl,
      "apps-action": coreApiUrl,
      "knowledge-base": coreApiUrl,
      inbox: conversationApiUrl,
    },
    {
      organisationID,
      Authorization: accessToken,
    }
  );

  const onUserIsTypingEvent = (payload?: UserTying) => {
    setUserTypingData(payload);
  };

  const onNewWebsocketEvent = () => {
    setShouldPopSound(true);
  };

  useEffect(() => {
    if (accessToken && organisationID) {
      initializePusher(accessToken, organisationID, conversationApiUrl, env);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, organisationID, conversationApiUrl, env]);

  return (
    <QueryClientProvider client={queryClient}>
      <SimpuContext.Provider
        value={{
          apiClient,
          accessToken,
          shouldPopSound,
          userTypingData,
          onNewWebsocketEvent,
          onUserIsTypingEvent,
        }}
      >
        <SocketProvider>
          <Provider>
            <Box colorPalette={colorPalette}>{children}</Box>
          </Provider>
        </SocketProvider>
      </SimpuContext.Provider>
    </QueryClientProvider>
  );
};
