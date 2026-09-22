"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/providers/AuthProvider";

export function AccountActions({
  email,
  phone,
  name,
  isAdmin,
}: {
  email: string | null;
  phone: string | null;
  name: string;
  isAdmin: boolean;
}) {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
      <span>
        {name} · {email || phone}
      </span>
      <Link href="/wishlist" className="text-gold">
        Wishlist
      </Link>
      {isAdmin && (
        <Link href="/admin" className="text-gold">
          Admin
        </Link>
      )}
      <Button
        variant="line"
        size="sm"
        onClick={async () => {
          await logout();
          router.push("/");
        }}
      >
        Logout
      </Button>
    </div>
  );
}
