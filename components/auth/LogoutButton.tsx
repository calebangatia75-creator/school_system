"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type LogoutButtonProps = {
  destination: string;
  endpoint?: string;
  label?: string;
};

export function LogoutButton({
  destination,
  endpoint = "/api/auth/logout",
  label = "Logout"
}: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch(endpoint, { method: "POST" });
      router.replace(destination);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button type="button" variant="secondary" onClick={handleLogout} disabled={loading}>
      <LogOut className="mr-2 h-4 w-4" />
      {loading ? "Leaving..." : label}
    </Button>
  );
}
