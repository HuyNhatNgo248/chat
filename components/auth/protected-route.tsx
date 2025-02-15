"use client";
import type { Subscription, Consumer, Mixin } from "@rails/actioncable";

import { useEffect, useContext, useState, createContext } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import createCable from "@/lib/cable";

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

interface UserStatusType {
  action_type?: string;
  [key: number]: boolean;
}

type NotificationType = object & {
  action_type: string;
  chat_id: number;
  id?: number; // message id
  user_id?: number;
};

type UserChannelType = Subscription<Consumer> &
  Mixin & {
    received: (data: { data: NotificationType }) => void;
  };

type UserAppearanceChannelType = Subscription<Consumer> &
  Mixin & {
    received: (data: { data: UserStatusType }) => void;
  };

interface UserContextProps {
  notification: NotificationType | null;
  setNotification: React.Dispatch<
    React.SetStateAction<NotificationType | null>
  >;
  currentUserId: number | null;
  setCurrentUserId: React.Dispatch<React.SetStateAction<number | null>>;
  userStatuses: UserStatusType;
}

export const USER_ACTION = {
  CREATE: "create",
  DELETE: "delete",
};

const USER_APPEARANCE_ACTION = {
  STATUS_UPDATE: "status_update",
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationType | null>(
    null,
  );
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [userStatuses, setUserStatuses] = useState<UserStatusType>({});
  const [userChannel, setUserChannel] = useState<UserChannelType | null>(null);
  const [userAppearanceChannel, setUserAppearanceChannel] =
    useState<UserAppearanceChannelType | null>(null);
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");

  useEffect(() => {
    if (!token || !userId) router.push("/signin");

    setCurrentUserId(Number(userId));
  }, [router, token, userId]);

  useEffect(() => {
    if (!token) return;

    const cable = createCable(token);

    const userChannel1 = cable.subscriptions.create(
      {
        channel: "UserChannel",
      },
      {
        received: (data: { data: NotificationType }) => {
          switch (data.data.action_type) {
            case USER_ACTION.CREATE:

            case USER_ACTION.DELETE: {
              setNotification(data.data);
              break;
            }
          }
        },
      },
    );

    const userAppearanceChannel1 = cable.subscriptions.create(
      {
        channel: "UserAppearanceChannel",
      },
      {
        received: (data: { data: UserStatusType }) => {
          switch (data.data.action_type) {
            case USER_APPEARANCE_ACTION.STATUS_UPDATE: {
              setUserStatuses((prev) => ({
                ...prev,
                ...data.data,
              }));
              break;
            }
          }
        },
      },
    );

    setUserChannel(userChannel1);
    setUserAppearanceChannel(userAppearanceChannel1);

    return () => {
      userChannel1.unsubscribe();
      userAppearanceChannel1.unsubscribe();
    };
  }, [token]);

  useEffect(() => {
    if (token) return;

    if (userChannel) {
      userChannel.unsubscribe();
      setUserChannel(null);
    }

    if (userAppearanceChannel) {
      userAppearanceChannel.unsubscribe();
      setUserAppearanceChannel(null);
    }

    return;
  }, [userChannel, userAppearanceChannel, token]);

  return (
    <UserContext.Provider
      value={{
        notification,
        setNotification,
        currentUserId,
        setCurrentUserId,
        userStatuses,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default ProtectedRoute;
