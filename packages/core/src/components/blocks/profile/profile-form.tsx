"use client";

import React from "react";
import { UserProfile } from "@/types";
import { QueryKeys, useGetProfile } from "@/utils/queries";
import { Box, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FormikHelpers, useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useSimpuProvider } from "../provider";

export interface ProfileFormProps {
  onProfileUpdateError?(error: any): void;
  onProfileUpdateSuccess?(profile: UserProfile): void;
}

export const ProfileForm = (props: ProfileFormProps) => {
  const { onProfileUpdateError, onProfileUpdateSuccess } = props;

  const { apiClient } = useSimpuProvider();

  const { data } = useGetProfile();
  const queryClient = useQueryClient();

  const handleProfileUpdate = async (
    values: Partial<UserProfile>,
    formikHelpers: FormikHelpers<Partial<UserProfile>>
  ) => {
    formikHelpers.setSubmitting(true);
    try {
      const profile = await apiClient.profile.updateProfile({
        ...values,
        user_id: data?.user.id,
      });
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.getProfile] });
      onProfileUpdateSuccess?.(profile);
    } catch (error: any) {
      formikHelpers.setSubmitting(false);
      onProfileUpdateError?.(error);
    }
  };

  const { values, errors, touched, isSubmitting, handleSubmit, handleChange } =
    useFormik<Partial<UserProfile>>({
      onSubmit: handleProfileUpdate,
      initialValues: data?.profile ?? {
        email: "",
        last_name: "",
        first_name: "",
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={6}>
        <Stack px={4}>
          <Text textStyle="sm" fontWeight="medium">
            Your name
          </Text>
          <HStack gap={4}>
            <Field
              errorText={errors.first_name}
              invalid={!!touched.first_name && !!errors.first_name}
            >
              <Input
                size="sm"
                type="text"
                name="first_name"
                variant="flushed"
                placeholder="First name"
                value={values.first_name}
                onChange={handleChange}
              />
            </Field>
            <Field
              errorText={errors.last_name}
              invalid={!!touched.last_name && !!errors.last_name}
            >
              <Input
                type="text"
                size="sm"
                name="last_name"
                variant="flushed"
                placeholder="Last name"
                value={values.last_name}
                onChange={handleChange}
              />
            </Field>
          </HStack>
        </Stack>
        <Stack px={4}>
          <Text textStyle="sm" fontWeight="medium">
            Your email
          </Text>
          <Field
            errorText={errors.email}
            invalid={!!touched.email && !!errors.email}
          >
            <Input
              readOnly
              size="sm"
              type="email"
              name="email"
              variant="flushed"
              placeholder="email@example.com"
              value={values.email}
              onChange={handleChange}
            />
          </Field>
        </Stack>
        <Box px={4}>
          <Button type="submit" size="sm" loading={isSubmitting}>
            Update
          </Button>
        </Box>
      </Stack>
    </form>
  );
};
