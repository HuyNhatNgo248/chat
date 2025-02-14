"use client";

import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  PlayIcon,
  CloseIcon,
  PauseIcon,
  SendIcon,
} from "@/components/shared/icons";
import { format } from "date-fns";
import { fetchWithToken } from "@/lib/fetch";
import API_ENDPOINTS from "@/lib/api-endpoints";
import { jsonToFormData } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/spinner";
import { useChatStore } from "@/hooks/use-chat-store";

interface VoiceRecorderProps {
  isRecording: boolean;
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>;
}

function formatMilliseconds(ms: number): string {
  const date = new Date(ms);
  return format(date, "mm:ss");
}

interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <div className={cn("bg-gray-200 px-4 py-2", className)}>
      <div className="flex gap-2 w-full items-center">{children}</div>
    </div>
  );
};

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  setIsRecording,
}) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [displayPause, setDisplayPause] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const selectedChat = useChatStore((state) => state.selectedChat);

  const recorderControls = useVoiceVisualizer({
    onPausedAudioPlayback: () => setDisplayPause(false),
    onResumedAudioPlayback: () => setDisplayPause(true),
    onStartAudioPlayback: () => setDisplayPause(true),
    onEndAudioPlayback: () => setDisplayPause(false),
  });

  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    clearCanvas,
    recordingTime,
    duration,
    recordedBlob,
    error,
    isProcessingRecordedAudio,
  } = recorderControls;

  useEffect(() => {
    if (!error) return;

    console.error(error);
  }, [error]);

  useEffect(() => {
    if (isRecording) startRecording();
    else {
      stopRecording();
      setPreviewMode(false);
      clearCanvas();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  const handleSendMessage = async () => {
    if (!recordedBlob || !selectedChat) return;

    setButtonDisabled(true);

    try {
      await fetchWithToken({
        url: API_ENDPOINTS.MESSAGE.CREATE(selectedChat.id),
        options: {
          method: "POST",
          body: jsonToFormData({
            message: {
              chat_id: selectedChat.id,
              content: "",
              files: recordedBlob,
            },
          }),
        },
      });

      setIsRecording(false);
      setButtonDisabled(false);
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  const voiceVisualizerBaseProps = {
    controls: recorderControls,
    height: 50,
    mainContainerClassName: "w-full px-4 py-2",
    isControlPanelShown: false,
    isDefaultUIShown: false,
    isAudioProcessingTextShown: false,
    barWidth: 3,
    speed: 1,
    isProgressIndicatorTimeOnHoverShown: false,
    isProgressIndicatorTimeShown: false,
  };

  return (
    <>
      {/* display soundwave */}
      <Wrapper className={cn(previewMode ? "block" : "hidden")}>
        <button
          className="p-2 rounded-full bg-gray-50 min-h-content"
          onClick={() => {
            setIsRecording(false);
          }}
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div
          className={cn(
            "flex gap-2 items-center flex-grow h-16 rounded-full overflow-hidden px-4 bg-gray-100"
          )}
        >
          <Button
            className="shadow-none p-0"
            onClick={togglePauseResume}
            disabled={isProcessingRecordedAudio}
          >
            <div className="rounded-full bg-gray-50 p-2">
              {displayPause ? (
                <PauseIcon className="w-4 h-4" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
            </div>
          </Button>

          {isProcessingRecordedAudio && <Spinner />}

          <VoiceVisualizer
            {...voiceVisualizerBaseProps}
            backgroundColor="#3A3C3C"
            mainBarColor="#e4e6eb"
            secondaryBarColor="#c8c9cc"
          />

          <p className="text-muted rounded-full bg-gray-50 py-1 px-2 text-xs">
            {/* duration is in second */}
            {formatMilliseconds(duration * 1000)}
          </p>

          <Button
            onClick={() => {
              handleSendMessage();
            }}
            disabled={buttonDisabled}
            className="shadow-none p-0"
          >
            <div className="p-2 bg-dark-green rounded-full">
              <SendIcon className="w-4 h-4 text-gray-300" />
            </div>
          </Button>
        </div>
      </Wrapper>

      {/* audio recording */}
      {isRecording && !previewMode && (
        <Wrapper>
          <div
            className={cn(
              "flex gap-2 items-center flex-grow h-16 rounded-full overflow-hidden px-4 bg-[#362221]"
            )}
          >
            <VoiceVisualizer
              {...voiceVisualizerBaseProps}
              backgroundColor="#362221"
              mainBarColor="#FF453A"
              secondaryBarColor="#9A332D"
            />

            <p className="text-[#FF453A] text-sm">
              {formatMilliseconds(recordingTime)}
            </p>

            <button
              className="rounded-full flex justify-center items-center bg-recorder-red-200 bg-[#9A332D] p-2"
              onClick={() => {
                stopRecording();
                setPreviewMode(true);
              }}
            >
              <span className="rounded-sm w-3 h-3 bg-[#FF453A]" />
            </button>
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default VoiceRecorder;
