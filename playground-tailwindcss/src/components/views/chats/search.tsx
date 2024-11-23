"use client";

import { Input } from "@/components/ui/input";
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const SearchInput = (
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => {
  return (
    <Input type="search" className="placeholder:text-[#686868]" {...props} />
  );
};
