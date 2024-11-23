import { MainContent, ViewContent } from "@/components/layout/content";
import { SettingsItem } from "@/components/layout/settings";
import { ProfileDetails } from "@simpu/inbox-sdk";
import { Link as NextLink } from "next-view-transitions";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOut, IoShareSocialSharp } from "react-icons/io5";

export default async function SettingsPage() {
  return (
    <>
      <ViewContent>
        <div className="flex items-center px-6 h-[60px]">
          <h2>Settings</h2>
        </div>
        <NextLink
          href="/settings/profile"
          className="w-full border-b hover:bg-muted hover:no-underline"
        >
          <ProfileDetails />
        </NextLink>
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
        <SettingsItem.Root href="/signOut" className="text-red">
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
