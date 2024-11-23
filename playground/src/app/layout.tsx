import { SimpuProvider } from "@simpu/inbox-sdk";
import { Nav } from "@/components/layout/nav";
import { Toaster } from "@/components/ui/toaster";
import { HStack } from "@chakra-ui/react";
import type { Metadata } from "next";
import { ViewTransitions } from "next-view-transitions";
import { Provider } from "@/components/ui/provider";

export const metadata: Metadata = {
  title: "Simpu Socials",
  description:
    "Omichannel inbox for social apps like Facebook Messenger, WhatsApp and Instagram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body>
          <Provider>
            <SimpuProvider
              colorPalette="green"
              organisationID="c91740d3988211eba1bb86d35ec4f76b"
              // accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjYyMzY1MTksImlhdCI6MTcyMzY0NDUxOSwic3ViIjoiOGYyNzMxNTNhNjcyMTFlYmJkOTM5YTg4ZWI0Y2E5YjcifQ.IxRhOLFAZVg2PcSM-Dz3aKgbPwnJWTB7pARZccW350U"
              accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQ5NjA1NDIsImlhdCI6MTczMjM2ODU0Miwic3ViIjoiMDZkNDcwNDdlM2EyMTFlYTkzNzA4NmQzNWVjNGY3NmIifQ.9tCz-q1rDKzgEdAVPOIkO9WDlM16H4bRu_S6scRoKpA"
            >
              <HStack gap={0} h="100vh" w="full" overflowY="hidden">
                <Nav />
                {children}
              </HStack>
              <Toaster />
            </SimpuProvider>
          </Provider>
        </body>
      </html>
    </ViewTransitions>
  );
}
