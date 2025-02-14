"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) return router.push("/chat");

    return router.push("/signin");
  }, [router]);

  return null;
}
