import { MainContent, ViewContent } from "@/components/layout/content";
import { SettingsItem } from "@/components/layout/settings";
import { Link as ChakraLink, Flex, Heading } from "@chakra-ui/react";
import { ProfileDetails } from "@simpu/inbox-sdk";
import { Link as NextLink } from "next-view-transitions";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOut, IoShareSocialSharp } from "react-icons/io5";

export default async function SettingsPage() {
  return (
    <>
      <ViewContent>
        <Flex alignItems="center" px={6} h="60px">
          <Heading>Settings</Heading>
        </Flex>
        <ChakraLink
          w="full"
          asChild
          rounded="0"
          borderBottomWidth={1}
          _hover={{ bg: "bg.subtle", textDecoration: "none" }}
        >
          <NextLink href="/settings/profile">
            <ProfileDetails />
          </NextLink>
        </ChakraLink>
        <SettingsItem.Root href="/settings/profile">
          <SettingsItem.Icon>
            <FaUserCircle size={20} />
          </SettingsItem.Icon>
          <SettingsItem.Content>Profile</SettingsItem.Content>
        </SettingsItem.Root>
        <SettingsItem.Root href="/settings/accounts">
          <SettingsItem.Icon>
            <IoShareSocialSharp size={20} />
          </SettingsItem.Icon>
          <SettingsItem.Content>Accounts</SettingsItem.Content>
        </SettingsItem.Root>
        <SettingsItem.Root href="/signOut" colorPalette="red">
          <SettingsItem.Icon>
            <IoLogOut size={20} />
          </SettingsItem.Icon>
          <SettingsItem.Content>Logout</SettingsItem.Content>
        </SettingsItem.Root>
      </ViewContent>
      <MainContent />
    </>
  );
}
