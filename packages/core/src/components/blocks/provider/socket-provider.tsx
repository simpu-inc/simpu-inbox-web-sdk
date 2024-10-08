"use client";

import { useInboxWebsocket } from "@/utils/hooks";
import { useGetNotificationSounds, useGetProfile } from "@/utils/queries";
import React, { createContext, ReactNode, useEffect, useRef } from "react";
import { useSimpuProvider } from "./simpu-provider";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useGetProfile();
  const { data: sounds } = useGetNotificationSounds();

  const { shouldPopSound, onNewWebsocketEvent, onUserIsTypingEvent } =
    useSimpuProvider();

  const audioRef = useRef<HTMLAudioElement>(null);
  const audioSourceRef = useRef<HTMLSourceElement>(null);

  useEffect(() => {
    if (sounds && sounds.length) {
      const soundUrl = sounds?.[0].url;
      audioSourceRef!.current!.src = soundUrl ?? "";
      audioRef?.current?.load();
    }
  }, [sounds]);

  useEffect(() => {
    try {
      if (audioRef && audioRef.current && shouldPopSound) {
        audioRef.current.load();
        audioRef.current.play();
        // TODO: Stop Pop Sound
        // dispatch(stopPopSound());
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPopSound]);

  useInboxWebsocket({
    profile: data?.profile,
    onNewWebsocketEvent,
    onUserIsTypingEvent,
  });

  return (
    <SocketContext.Provider value={null}>
      <audio controls ref={audioRef} style={{ display: "none" }}>
        <source ref={audioSourceRef} />
        Your browser does not support the audio element.
      </audio>
      {children}
    </SocketContext.Provider>
  );
};
