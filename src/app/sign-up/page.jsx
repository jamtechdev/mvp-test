"use client"
import LayoutManager from "@/_components/common/LayoutManager";
import SignUp from "../_components/SignUp";

export default function SignUpPage() {
  return (
    <LayoutManager includeAuthLayout={false}>
      <SignUp />
    </LayoutManager>
  );
}
