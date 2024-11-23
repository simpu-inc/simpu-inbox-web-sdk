"use client";

import { Provider } from "@/components/ui/provider";
import { UserTying } from "@/types";
import { APIClient } from "@/utils/api-client";
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
    apiUrl?: string;
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
    options: { apiUrl } = {},
  } = props;

  const [queryClient] = useState(() => new QueryClient());
  const [shouldPopSound, setShouldPopSound] = useState(false);
  const [userTypingData, setUserTypingData] = useState<UserTying | undefined>();

  const apiClient = new APIClient(
    {
      core: constants.CORE_API_URL,
      inbox: apiUrl ?? constants.CONVERSATION_API_URL,
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
      initializePusher(accessToken, organisationID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, organisationID]);

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
