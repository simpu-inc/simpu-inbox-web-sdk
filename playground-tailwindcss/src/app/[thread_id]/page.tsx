import { MainContent, ViewContent } from "@/components/layout/content";
import { ChatsView } from "@/components/views/chats";
import { ThreadView } from "@/components/views/thread";
import { ThreadContactInfo } from "@/components/views/thread/contact-info";
import { Suspense } from "react";

export default function Thread() {
  return (
    <>
      <ViewContent>
        <ChatsView />
      </ViewContent>
      <MainContent>
        <div className="flex w-full h-full items-start gap-0">
          <div className="flex flex-col gap-0 flex-1 h-full relative">
            <ThreadView />
          </div>
          <Suspense>
            <ThreadContactInfo />
          </Suspense>
        </div>
      </MainContent>
    </>
  );
}
