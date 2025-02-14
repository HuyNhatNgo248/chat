"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const INACTIVE_THRESHOLD =
  +(process.env.NEXT_PUBLIC_PAGE_INACTIVITY_THRESHOLD || 6) * 60 * 60 * 1000; // 6 hours in milliseconds

const RefreshAfterInactivity = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAndRefresh = () => {
      const lastActiveTime = Cookies.get("lastActiveTime");
      const currentTime = Date.now();

      if (lastActiveTime) {
        const timeSinceLastActive = currentTime - parseInt(lastActiveTime, 10);

        if (timeSinceLastActive > INACTIVE_THRESHOLD) {
          router.refresh(); // Refresh the page
          // Optionally, refetch critical data
        }
      }

      // Update last active time
      Cookies.set("lastActiveTime", currentTime.toString(), { expires: 7 }); // Set cookie to expire in 7 days
    };

    // Check on focus and initial load
    checkAndRefresh();

    // Add event listeners
    window.addEventListener("focus", checkAndRefresh);
    window.addEventListener("load", checkAndRefresh);

    return () => {
      window.removeEventListener("focus", checkAndRefresh);
      window.removeEventListener("load", checkAndRefresh);
    };
  }, [router]);

  return null;
};

export default RefreshAfterInactivity;
