"use client";

import React, { ReactNode, useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { QueryKeys } from "@/utils/queries";
import {
  Box,
  Flex,
  FormatByte,
  Icon,
  IconButton,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuDownload, LuX } from "react-icons/lu";
import { useSimpuProvider } from "../provider";

const getIconName = (type: string): { viewBox: string; path: ReactNode } => {
  switch (true) {
    case type?.includes("image/"):
      return {
        viewBox: "0 0 22 22",
        path: (
          <g fill="none" fillRule="evenodd">
            <path d="M0 0L22 0 22 22 0 22z" />
            <rect
              width="18.333"
              height="14.667"
              x="1.833"
              y="3.667"
              fill="#0015FF"
              opacity=".3"
              rx="1.84"
            />
            <path
              fill="#0015FF"
              d="M3.667 18.333L9.625 10.083 15.583 18.333z"
              opacity=".3"
            />
            <path
              fill="#3D50DF"
              d="M10.083 18.333L14.208 12.833 18.333 18.333z"
            />
            <circle
              cx="16.958"
              cy="7.792"
              r="1.375"
              fill="#0015FF"
              opacity=".3"
            />
          </g>
        ),
      };
    case type?.includes("audio/"):
      return {
        viewBox: "0 0 22 22",
        path: (
          <g fill="none" fillRule="evenodd">
            <path d="M0 0H22V22H0z" />
            <path
              fill="#3D50DF"
              fillRule="nonzero"
              d="M16.5 3.825v1.612c0 .538-.503.88-.917.98-.595.142-2.122.447-4.583.916v9.672c0 .088-.008.169-.022.243-.17 1.128-1.327 2.002-2.728 2.002-1.519 0-2.75-1.026-2.75-2.292 0-1.265 1.231-2.291 2.75-2.291.321 0 .63.046.917.13v-9.36c0-.47.293-.885.723-1.025L15.161 2.8c.664-.217 1.339.3 1.339 1.025z"
            />
          </g>
        ),
      };
    case type?.includes("video/"):
      return {
        viewBox: "0 0 22 22",
        path: (
          <g fill="none" fillRule="evenodd">
            <path d="M0 0H22V22H0z" />
            <path
              fill="#0015FF"
              d="M16.493 2.75c1.017 0 1.84.824 1.84 1.84v12.82c0 1.016-.823 1.84-1.84 1.84H5.507c-1.017 0-1.84-.824-1.84-1.84V4.59c0-1.016.823-1.84 1.84-1.84h10.986zm.464 12.833h-.914c-.254 0-.46.206-.46.46v.914c0 .254.206.46.46.46h.914c.254 0 .46-.206.46-.46v-.914c0-.254-.206-.46-.46-.46zm-11 0h-.914c-.254 0-.46.206-.46.46v.914c0 .254.206.46.46.46h.914c.254 0 .46-.206.46-.46v-.914c0-.254-.206-.46-.46-.46zm0-3.666h-.914c-.254 0-.46.206-.46.46v.913c0 .254.206.46.46.46h.914c.254 0 .46-.206.46-.46v-.913c0-.254-.206-.46-.46-.46zm11 0h-.914c-.254 0-.46.206-.46.46v.913c0 .254.206.46.46.46h.914c.254 0 .46-.206.46-.46v-.913c0-.254-.206-.46-.46-.46zm-11-3.667h-.914c-.254 0-.46.206-.46.46v.913c0 .254.206.46.46.46h.914c.254 0 .46-.206.46-.46V8.71c0-.254-.206-.46-.46-.46zm11 0h-.914c-.254 0-.46.206-.46.46v.913c0 .254.206.46.46.46h.914c.254 0 .46-.206.46-.46V8.71c0-.254-.206-.46-.46-.46zm-11-3.667h-.914c-.254 0-.46.206-.46.46v.914c0 .254.206.46.46.46h.914c.254 0 .46-.206.46-.46v-.914c0-.254-.206-.46-.46-.46zm11 0h-.914c-.254 0-.46.206-.46.46v.914c0 .254.206.46.46.46h.914c.254 0 .46-.206.46-.46v-.914c0-.254-.206-.46-.46-.46z"
              opacity=".3"
            />
            <path
              fill="#3D50DF"
              d="M10.409 13.356l2.383-1.629c.21-.143.263-.43.12-.64-.032-.046-.072-.086-.12-.119L10.41 9.33c-.21-.144-.496-.09-.64.119-.053.076-.08.167-.08.26v3.268c0 .254.205.46.46.46.092 0 .182-.028.259-.08z"
            />
          </g>
        ),
      };
    case type?.includes("application/pdf"):
      return {
        viewBox: "0 0 24 24",
        path: (
          <>
            <path d="M20 22.5H4V1.5H15L20 6.5V22.5Z" fill="#FF5722" />
            <path d="M19.25 7H14.5V2.25L19.25 7Z" fill="#FBE9E7" />
            <path
              d="M7.90344 14.7499V16.4999H6.89844V11.5234H8.59394C9.08594 11.5234 9.47894 11.6764 9.77144 11.9814C10.0639 12.2864 10.2104 12.6829 10.2104 13.1709C10.2104 13.6589 10.0654 14.0434 9.77644 14.3264C9.48744 14.6094 9.08594 14.7499 8.57294 14.7499H7.90344ZM7.90344 13.9124H8.59394C8.78544 13.9124 8.93344 13.8499 9.03844 13.7244C9.14344 13.5989 9.19544 13.4169 9.19544 13.1774C9.19544 12.9289 9.14194 12.7314 9.03494 12.5839C8.92794 12.4374 8.78444 12.3629 8.60444 12.3604H7.90344V13.9124ZM10.8804 16.4999V11.5234H12.1964C12.7774 11.5234 13.2409 11.7079 13.5854 12.0769C13.9309 12.4459 14.1069 12.9519 14.1139 13.5944V14.4009C14.1139 15.0549 13.9409 15.5684 13.5964 15.9404C13.2504 16.3139 12.7749 16.4999 12.1689 16.4999H10.8804ZM11.8849 12.3609V15.6659H12.1859C12.5209 15.6659 12.7569 15.5774 12.8934 15.4009C13.0299 15.2244 13.1019 14.9199 13.1089 14.4869V13.6224C13.1089 13.1574 13.0439 12.8334 12.9139 12.6504C12.7839 12.4669 12.5629 12.3704 12.2509 12.3614H11.8849V12.3609ZM17.4019 14.4694H15.8399V16.4999H14.8349V11.5234H17.5899V12.3609H15.8399V13.6359H17.4019V14.4694Z"
              fill="#FFEBEE"
            />
          </>
        ),
      };
    case type?.includes("text/csv"):
      return {
        viewBox: "0 0 24 24",
        path: (
          <>
            <path d="M20 22.5H4V1.5H15L20 6.5V22.5Z" fill="#4DB6AC" />
            <path d="M19.25 7H14.5V2.25L19.25 7Z" fill="#E0F2F1" />
            <path
              d="M10.0241 14.8426C9.99909 15.4101 9.83959 15.8396 9.54559 16.1311C9.25159 16.4226 8.83709 16.5686 8.30159 16.5686C7.73909 16.5686 7.30759 16.3836 7.00809 16.0136C6.70859 15.6431 6.55859 15.1151 6.55859 14.4291V13.5916C6.55859 12.9081 6.71359 12.3811 7.02359 12.0106C7.33359 11.6406 7.76409 11.4556 8.31559 11.4556C8.85759 11.4556 9.26959 11.6071 9.55109 11.9101C9.83259 12.2131 9.99259 12.6486 10.0311 13.2156H9.02259C9.01359 12.8646 8.95959 12.6226 8.86009 12.4891C8.76109 12.3561 8.57909 12.2896 8.31509 12.2896C8.04609 12.2896 7.85609 12.3836 7.74409 12.5711C7.63259 12.7596 7.57309 13.0686 7.56659 13.4991V14.4391C7.56659 14.9336 7.62159 15.2731 7.73259 15.4576C7.84359 15.6421 8.03309 15.7346 8.30159 15.7346C8.56609 15.7346 8.74809 15.6701 8.84859 15.5416C8.94909 15.4126 9.00559 15.1796 9.01959 14.8426H10.0241ZM12.7446 15.1946C12.7446 14.9921 12.6926 14.8386 12.5891 14.7351C12.4851 14.6311 12.2966 14.5236 12.0231 14.4121C11.5241 14.2231 11.1651 14.0016 10.9466 13.7471C10.7276 13.4931 10.6186 13.1931 10.6186 12.8466C10.6186 12.4271 10.7671 12.0906 11.0646 11.8366C11.3621 11.5821 11.7396 11.4551 12.1976 11.4551C12.5031 11.4551 12.7751 11.5196 13.0146 11.6481C13.2541 11.7771 13.4381 11.9586 13.5666 12.1936C13.6951 12.4286 13.7596 12.6951 13.7596 12.9936H12.7581C12.7581 12.7611 12.7081 12.5841 12.6096 12.4621C12.5101 12.3406 12.3671 12.2796 12.1806 12.2796C12.0051 12.2796 11.8681 12.3316 11.7706 12.4351C11.6726 12.5391 11.6236 12.6786 11.6236 12.8541C11.6236 12.9906 11.6781 13.1146 11.7876 13.2251C11.8971 13.3356 12.0906 13.4496 12.3686 13.5686C12.8541 13.7441 13.2066 13.9591 13.4261 14.2146C13.6461 14.4701 13.7561 14.7946 13.7561 15.1886C13.7561 15.6216 13.6186 15.9601 13.3426 16.2036C13.0666 16.4471 12.6916 16.5691 12.2181 16.5691C11.8966 16.5691 11.6041 16.5031 11.3396 16.3711C11.0751 16.2391 10.8686 16.0496 10.7191 15.8036C10.5696 15.5576 10.4951 15.2671 10.4951 14.9321H11.5036C11.5036 15.2191 11.5596 15.4276 11.6711 15.5576C11.7826 15.6876 11.9651 15.7526 12.2181 15.7526C12.5691 15.7516 12.7446 15.5661 12.7446 15.1946ZM16.0431 15.1331L16.8806 11.5236H18.0016L16.5661 16.5001H15.5201L14.0946 11.5236H15.2091L16.0431 15.1331Z"
              fill="#00695C"
            />
          </>
        ),
      };
    case type?.includes(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ):
    case type?.includes("application/vnd.ms-excel"):
      return {
        viewBox: "0 0 24 24",
        path: (
          <>
            <path d="M20 22.5H4V1.5H15L20 6.5V22.5Z" fill="#388E3C" />
            <path d="M19.25 7H14.5V2.25L19.25 7Z" fill="#E8F5E9" />
            <path
              d="M11.8676 13.2286L12.9136 11.1016H14.6756L12.8871 14.2746L14.7241 17.5001H12.9441L11.8676 15.3336L10.7911 17.5001H9.01562L10.8481 14.2746L9.06413 11.1016H10.8221L11.8676 13.2286Z"
              fill="white"
            />
          </>
        ),
      };
    default:
      return {
        viewBox: "0 0 56 56",
        path: (
          <g fill="#50B5FF">
            <rect width="56" height="56" opacity=".1" rx="15" />
            <path d="M34.065 23.4L32.7 21.762V23.4h1.365zm3.135 1.326V34.3c0 2.043-1.657 3.7-3.7 3.7H22.7c-2.043 0-3.7-1.657-3.7-3.7V21.7c0-2.043 1.657-3.7 3.7-3.7h8.578c.564 0 1.1.25 1.46.684l4.022 4.825c.284.342.44.772.44 1.217zm-2 .674h-2.6c-1.05 0-1.9-.85-1.9-1.9V20h-8c-.939 0-1.7.761-1.7 1.7v12.6c0 .939.761 1.7 1.7 1.7h10.8c.939 0 1.7-.761 1.7-1.7v-8.9zm-12.097 6.2h9.994c.167 0 .303.12.303.267v1.466c0 .148-.136.267-.303.267h-9.994c-.167 0-.303-.12-.303-.267v-1.466c0-.148.136-.267.303-.267z" />
          </g>
        ),
      };
  }
};

export function AttachmentItem({
  file,
  index,
  uploadType,
  credential_id,
  showDeleteButton = true,
  onClick,
  onDelete,
  onUpload,
  onDownload,
  onUploadError,
  setIsUploading,
}: {
  file: any;
  index: number;
  credential_id?: string;
  showDeleteButton?: boolean;
  uploadType?: "message" | "comment";
  onClick?(): void;
  onDownload?(): void;
  onUploadError?(error: any): void;
  onUpload?(upload_ids: string[]): void;
  setIsUploading?: (isUploading: boolean) => void;
  onDelete?(upload_id: string, index: number): void;
}) {
  const { name, size, data, type, mimetype } = file;

  const { path, viewBox } = getIconName(onDownload ? mimetype : type);

  const { apiClient } = useSimpuProvider();

  const [progress, setProgress] = useState(0);
  const [uploadId, setUploadId] = useState<string | undefined>();

  const handleDelete = () => {
    onDelete?.(uploadId ?? "", index);
  };

  async function upload(
    credential_id?: string | null,
    type?: "message" | "comment"
  ) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (type) {
        formData.set("type", type);
      }

      setIsUploading?.(true);
      const { attachment_id } = await apiClient.inbox.accounts.uploadFile(
        credential_id ?? "",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent?.total ?? 100)
            );
            setProgress(percentCompleted);
          },
        }
      );
      setUploadId(attachment_id);
      setIsUploading?.(false);
      onUpload?.([attachment_id]);
    } catch (error) {
      onUploadError?.(error);
    }
  }

  const { error } = useQuery({
    queryKey: [
      QueryKeys.uploadAttachment,
      credential_id,
      uploadType,
      file.name,
    ],
    queryFn: () => upload(credential_id, uploadType),
    enabled: !!credential_id && !!file && !!file.name,
    refetchOnWindowFocus: false,
  });

  return (
    <Flex
      bg="bg"
      p="0.5rem"
      rounded="8px"
      maxWidth="200px"
      onClick={onClick}
      borderWidth="1px"
      position="relative"
      alignItems="center"
      willChange="opacity"
      transition="opacity 0.2s"
      ml={index === 0 ? "0" : "1.25rem"}
      _hover={{
        cursor: "pointer",
        "& > .download-container": {
          opacity: 1,
        },
      }}
    >
      {!error && credential_id && progress !== 100 && (
        <Spinner
          top="0"
          right="0"
          size="sm"
          borderWidth="2px"
          position="absolute"
          animationDuration="0.9s"
        />
      )}
      <Icon boxSize="2rem" viewBox={viewBox}>
        {path}
      </Icon>
      {onDownload && (
        <Box
          top="0"
          left="0"
          bottom="0"
          opacity={0}
          width="100%"
          bg="bg.muted"
          rounded="8px"
          position="absolute"
          className="download-container"
        >
          <Tooltip
            content="Download"
            aria-label="Download"
            positioning={{
              placement: "bottom",
            }}
          >
            <IconButton
              size="xs"
              top="0.95rem"
              left="0.95rem"
              position="absolute"
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              aria-label="download"
            >
              <LuDownload />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Box ml="0.5rem">
        <Text
          width="100px"
          textStyle="sm"
          color="fg.muted"
          fontWeight="500"
          overflow="hidden"
          whiteSpace="nowrap"
          style={{ textOverflow: "ellipsis" }}
        >
          {name
            ? (name || "").length <= 10
              ? name
              : `${name?.substring(0, 10)}...`
            : data.url}
        </Text>
        {size && (
          <Text textStyle="xs" color="fg.muted">
            <FormatByte value={size} />
          </Text>
        )}
      </Box>
      {showDeleteButton && progress === 100 && (
        <IconButton
          top="0"
          size="xs"
          right="0"
          variant="ghost"
          aria-label="close"
          position="absolute"
          onClick={handleDelete}
        >
          <LuX />
        </IconButton>
      )}
    </Flex>
  );
}
