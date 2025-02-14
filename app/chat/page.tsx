"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";

type ChatPageProps = object;

const ChatPage: React.FC<ChatPageProps> = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/chat/inbox");
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen grid grid-cols-1fr bg-gray-300 w-full" />
    </ProtectedRoute>
  );
};

export default ChatPage;
