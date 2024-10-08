"use client";

import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileUploadRoot, FileUploadTrigger } from "@/components/ui/file-button";
import { UserProfile } from "@/types";
import { QueryKeys, useGetProfile } from "@/utils/queries";
import { FileUploadFileRejectDetails, Stack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSimpuProvider } from "../provider";

export interface ProfileImageProps {
  onUploadError?(error: any): void;
  onUploadSuccess?(profile: UserProfile): void;
  onFileReject?: ((details: FileUploadFileRejectDetails) => void) | undefined;
}

export const ProfileImage = (props: ProfileImageProps) => {
  const { apiClient } = useSimpuProvider();

  const { data } = useGetProfile();
  const queryClient = useQueryClient();

  const { onUploadSuccess, onUploadError, onFileReject } = props;

  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const [preview, setPreview] = useState<
    string | ArrayBuffer | null | undefined
  >("");

  const handleUploadPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e?.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDropProfileImage = async (files: File[]) => {
    if (files) {
      const file = files[0];
      const formData = new FormData();
      formData.append("image", file);

      handleUploadPreview(file);

      try {
        setIsUploadingProfileImage(true);

        const profile = await apiClient.profile.saveUserProfileImage(formData);

        await queryClient.invalidateQueries({
          queryKey: [QueryKeys.getProfile],
        });

        onUploadSuccess?.(profile);
        setIsUploadingProfileImage(false);
      } catch (error: any) {
        setIsUploadingProfileImage(false);
        onUploadError?.(error);
      }
    }
  };

  return (
    <Stack px={4} direction="row" align="center">
      <Avatar
        size="2xl"
        src={
          preview && typeof preview === "string" ? preview : data?.profile.image
        }
      />
      <FileUploadRoot
        maxFiles={1}
        accept="image/*"
        id="profile_image"
        maxFileSize={2000000}
        onFileReject={onFileReject}
        onFileAccept={({ files }) => handleDropProfileImage(files)}
      >
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" loading={isUploadingProfileImage}>
            {preview || data?.profile.image ? "Change" : "Add"} profile photo
          </Button>
        </FileUploadTrigger>
      </FileUploadRoot>
    </Stack>
  );
};
