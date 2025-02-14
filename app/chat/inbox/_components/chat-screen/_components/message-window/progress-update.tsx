"use client";

import { Progress } from "@/components/ui/progress";
import { useUploadProgressContext } from "../..";
import { useEffect, useState } from "react";

type ProgressUpdateProps = object;

const ProgressUpdate: React.FC<ProgressUpdateProps> = () => {
  const { uploadProgress } = useUploadProgressContext();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (uploadProgress === null) return;

    setProgress(uploadProgress);
  }, [uploadProgress]);

  if (uploadProgress === null) return null;

  return (
    <div className="flex flex-col w-full gap-2 items-center">
      <Progress
        value={progress}
        classNames={{
          root: "w-64 h-6 bg-dark-green/30",
          indicator: "bg-dark-green",
        }}
      />

      <p className="text-xs text-muted">
        Processing uploaded media: {Math.floor(progress)}%
      </p>
    </div>
  );
};

export default ProgressUpdate;
