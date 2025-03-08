"use client";

import { Button, Skeleton } from "@/components/ui";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
} from "@/components/ui/dialog";
import { pusher, QueryKeys } from "@/utils";
import {
  Box,
  DialogRootProps,
  Flex,
  List,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import React, { useEffect, useState } from "react";
import { useSimpuProvider } from "../provider";
import { useAccountConnectOptions } from "./hook";
import { InboxType } from "@/types";

export interface QRCodeSetupDialogProps
  extends Omit<DialogRootProps, "children"> {
  channelId?: string;
  sessionId?: string;
  inboxType?: InboxType;
  reAuthenticate?: boolean;
  onScanSuccess?: () => void;
  setCredentialId?: (credential_id: string) => void;
}

type ViewControl = "qr-code" | "warning";

export const QRCodeSetupDialog = (props: QRCodeSetupDialogProps) => {
  const {
    sessionId,
    inboxType = "personal",
    onScanSuccess,
    setCredentialId,
    ...rest
  } = props;

  const queryClient = useQueryClient();
  const { apiClient } = useSimpuProvider();
  const { inbox } = useAccountConnectOptions({ inboxType });

  const [qrcode, setQrCode] = useState("");
  const [isScanned, setIsScanned] = useState(false);

  const [viewControl, setViewControl] = useState<ViewControl>("qr-code");

  const handleClosed = async () => {
    rest.onOpenChange?.({ open: false });
    onScanSuccess?.();
    setIsScanned(false);
    setViewControl("qr-code");
    await queryClient.invalidateQueries({
      queryKey: [QueryKeys.getInbox, inbox?.uuid],
    });
    await queryClient.invalidateQueries({
      queryKey: [QueryKeys.getInboxAccounts],
    });
  };

  const closeModal = async ({ open }: { open: boolean }) => {
    if (!isScanned) {
      try {
        sessionId &&
          (await apiClient.inbox.integrations.cancelQRCodeGeneration(
            sessionId ?? ""
          ));
      } catch (error) {
        console.log(error);
      }
    }
    rest.onOpenChange?.({ open });
  };

  useEffect(() => {
    const mirrorWhatsApp = async () => {
      try {
        const sessionChannel = pusher.subscribe(`public-session-${sessionId}`);
        sessionChannel.bind(
          "qrcode",
          async (payload: { type: string; data: any }) => {
            const { type, data } = payload;
            if (type === "error") {
              window.alert(data);
              rest.onOpenChange?.({ open: false });
              return;
            }
            if (type === "qr") {
              setQrCode(data);
            }
            if (type === "status") {
              switch (data) {
                case "cancelled":
                  break;
                case "scanned":
                  setIsScanned(true);
                  break;
                default:
                  setViewControl("warning");
                  break;
              }
            }
            if (type === "accounts") {
              setCredentialId?.(data.data.uuid);
            }
          }
        );
        if (sessionId) {
          setTimeout(async () => {
            await apiClient.inbox.integrations.generateQRCode(sessionId ?? "");
          }, 100);
        }
      } catch (error: any) {
        window.alert(error);
        rest.onOpenChange?.({ open: false });
      }
    };
    mirrorWhatsApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let view = <Box />;
  if (viewControl === "qr-code") {
    view = <QrCode qrcode={qrcode} isScanned={isScanned} />;
  } else {
    view = <Warning onClose={handleClosed} />;
  }

  return (
    <DialogRoot {...rest} onOpenChange={closeModal}>
      <DialogBackdrop />
      <DialogContent>
        <DialogCloseTrigger />
        <DialogBody>{view}</DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

function QrCode({ qrcode, isScanned }: { qrcode: string; isScanned: boolean }) {
  return (
    <>
      {isScanned ? (
        <Stack py="2rem" alignItems="center" justifyContent="center">
          <Flex
            height="auto"
            align="center"
            justify="center"
            direction="column"
          >
            <Spinner size="md" animationDirection="0.9s" borderWidth="3px" />
          </Flex>
          <Text>Logging in...</Text>
        </Stack>
      ) : (
        <Box py="2rem">
          {!qrcode ? (
            <Skeleton boxSize="9.375rem" />
          ) : (
            <QRCodeSVG
              level="L"
              size={200}
              value={qrcode}
              bgColor="#ffffff"
              fgColor="#000000"
              style={{ borderRadius: "8px" }}
            />
          )}
        </Box>
      )}

      <Text pb="1rem" fontSize="1.3125rem" color="gray.900" fontWeight="bold">
        To use WhatsApp:
      </Text>

      <List.Root mb="5rem" as="ol" fontSize="1rem" lineHeight="1.5rem">
        <List.Item color="gray.500">
          Open WhatsApp or WhatsApp Business App on your Phone.
        </List.Item>
        <List.Item color="gray.500">
          Tap Menu or Settings and select WhatsApp Web/ Desktop.
        </List.Item>
        <List.Item color="gray.500">
          Log out from all devices and click Scan QR code.
        </List.Item>
        <List.Item color="gray.500">
          Point your phone to this screen to capture code.
        </List.Item>
      </List.Root>
    </>
  );
}

function Warning({ onClose }: { onClose: () => void }) {
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Text
        pt="2rem"
        pb="2rem"
        color="gray.900"
        fontWeight="bold"
        lineHeight="30px"
        fontSize="1.3125rem"
      >
        Your WhatsApp account has been connected.
      </Text>
      <List.Root as="ol" fontSize="1rem" lineHeight="1.5rem">
        <List.Item color="gray.500">
          Keep your phone charged and connected to the internet at all time to
          avoid disconnection.
        </List.Item>
        <List.Item color="gray.500">
          If you logout this connection from Whatsapp on your phone, all your
          Whatsapp messages will be deleted this is to ensure your privacy.
        </List.Item>
      </List.Root>
      <Box my="1.5rem">
        <Button w="full" colorScheme="blue" onClick={handleClose}>
          Finish
        </Button>
      </Box>
    </>
  );
}
