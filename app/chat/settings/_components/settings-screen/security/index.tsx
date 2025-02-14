"use client";

import { SETTINGS_ID } from "../../../page";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ChangePasswordModal from "./change-password-modal";

const Security: React.FC = () => {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  return (
    <>
      <div className="w-full">
        <p className="text-xl font-semibold text-text capitalize mb-8">
          {SETTINGS_ID.SECURITY}
        </p>

        <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
          <p className="text-lg text-text">Password</p>

          <Button
            className="bg-dark-green"
            onClick={() => setPasswordModalOpen(true)}
          >
            Change password
          </Button>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        setIsOpen={setPasswordModalOpen}
      />
    </>
  );
};

export default Security;
