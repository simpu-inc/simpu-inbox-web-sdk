"use client";

import { Button } from "@/components/ui/button";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { QueryKeys } from "@/utils/queries";
import { Box, Stack, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSimpuProvider } from "../provider";
import { useAccountConnectOptions } from "./hook";
import { AccounButtonProps } from "./types";

export const Disconnect = ({
  account,
  onError,
  onSuccess,
  ...props
}: AccounButtonProps) => {
  const [isDisconnectingAccount, setIsDisconnectingAccount] = useState(false);
  const [openDisconnectAccountDialog, setOpenDisconnectAccountDialog] =
    useState(false);

  const queryClient = useQueryClient();
  const { apiClient } = useSimpuProvider();
  const { inbox } = useAccountConnectOptions();

  const handleDisconnectAccount = async () => {
    try {
      if (account) {
        setIsDisconnectingAccount(true);
        await apiClient.inbox.accounts.disconnectAccount(account?.uuid);
        await queryClient.invalidateQueries({
          queryKey: [QueryKeys.getInbox, inbox?.uuid],
        });
        setIsDisconnectingAccount(false);
        setOpenDisconnectAccountDialog(false);
        onSuccess?.();
      }
    } catch (error) {
      setIsDisconnectingAccount(false);
      onError?.(error);
    }
  };

  return (
    <>
      <Button onClick={() => setOpenDisconnectAccountDialog(true)} {...props} />
      {openDisconnectAccountDialog && (
        <DialogRoot
          open={openDisconnectAccountDialog}
          onOpenChange={({ open }) => setOpenDisconnectAccountDialog(open)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disconnect Account</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <Stack>
                <Text textStyle="sm">
                  After removing your account the following happens:
                </Text>
                <Box as="ul" listStyleType="circle">
                  <li>
                    <Text textStyle="xs" color="fg.muted">
                      Previous messages will be deleted.
                    </Text>
                  </li>
                  <li>
                    <Text textStyle="xs" color="fg.muted">
                      New messages to this account will not accepted.
                    </Text>
                  </li>
                </Box>
              </Stack>
            </DialogBody>
            <DialogFooter>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
              <Button
                size="sm"
                colorPalette="red"
                loading={isDisconnectingAccount}
                onClick={handleDisconnectAccount}
              >
                Disconnect Account
              </Button>
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
      )}
    </>
  );
};
