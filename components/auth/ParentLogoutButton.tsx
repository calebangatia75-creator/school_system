"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ParentLogoutButtonProps = {
  destination?: string;
};

export function ParentLogoutButton({ destination = "/login" }: ParentLogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace(destination);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-xl"
    >
      {loading ? "Leaving..." : "Logout"}
    </Button>
  );
}
