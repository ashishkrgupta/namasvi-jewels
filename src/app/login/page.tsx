import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Login",
  description: "Login to Namasvi Jewels with email or OTP.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
