"use client"
import LayoutManager from "@/_components/common/LayoutManager";
import SignIn from "../_components/SignIn";


export default function SignInPage() {
  return (
    <LayoutManager includeAuthLayout={false}>
        <SignIn />
    </LayoutManager>
  );
}
