import { MainContent, ViewContent } from "@/components/layout/content";
import { ChatsView } from "@/components/views/chats";

export default function Home() {
  return (
    <>
      <ViewContent>
        <ChatsView />
      </ViewContent>
      <MainContent />
    </>
  );
}
