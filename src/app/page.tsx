"use client";

import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
    <Label>BEM VINDO AO SITE</Label>
  </div>
  );
}
