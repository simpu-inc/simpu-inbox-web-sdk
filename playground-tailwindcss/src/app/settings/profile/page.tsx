import {
  MainContent,
  ViewContent,
  ViewHeader,
} from "@/components/layout/content";
import { ProfileForm, ProfileImage } from "@simpu/inbox-sdk";

export default async function ProfilePage() {
  return (
    <>
      <ViewContent>
        <div className="flex flex-col gap-6">
          <ViewHeader href="/settings">Profile</ViewHeader>
          <ProfileImage />
          <ProfileForm />
        </div>
      </ViewContent>
      <MainContent />
    </>
  );
}
