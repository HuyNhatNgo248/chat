import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { useEffect, useState } from "react";
import { createBlobFromUrl } from "@/lib/utils";
import { PlayIcon, PauseIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  voiceRecordUrl: string | null;
}

const VoiceRecordingDisplay: React.FC<VoiceRecorderProps> = ({
  voiceRecordUrl,
}) => {
  const [displayPause, setDisplayPause] = useState(false);

  const recorderControls = useVoiceVisualizer({
    onPausedAudioPlayback: () => setDisplayPause(false),
    onResumedAudioPlayback: () => setDisplayPause(true),
    onStartAudioPlayback: () => setDisplayPause(true),
    onEndAudioPlayback: () => setDisplayPause(false),
  });

  const {
    setPreloadedAudioBlob,
    togglePauseResume,
    clearCanvas,
    isPreloadedBlob,
  } = recorderControls;

  useEffect(() => {
    if (!voiceRecordUrl) return;

    createBlobFromUrl(voiceRecordUrl)
      .then((blob) => {
        setPreloadedAudioBlob(blob);
      })
      .catch((error) => {
        console.log("Failed to fetch blob from url", error);
      });

    return () => {
      clearCanvas();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceRecordUrl]);

  if (!voiceRecordUrl) return null;

  const voiceVisualizerBaseProps = {
    controls: recorderControls,
    width: 200,
    height: 50,
    mainContainerClassName: "w-full py-2",
    isControlPanelShown: false,
    isDefaultUIShown: false,
    isAudioProcessingTextShown: false,
    barWidth: 3,
    speed: 1,
    isProgressIndicatorTimeOnHoverShown: false,
    isProgressIndicatorTimeShown: false,
  };
  return (
    <div className="rounded-full overflow-hidden bg-gray-100 flex gap-4 px-4 py-1 items-center">
      <Button
        onClick={togglePauseResume}
        disabled={!isPreloadedBlob}
        className="shadow-none p-0 bg-transparent hover:bg-transparent"
      >
        <div className="p-2 rounded-full bg-gray-50 min-h-content">
          {displayPause ? (
            <PauseIcon className="w-4 h-4" />
          ) : (
            <PlayIcon className="w-4 h-4" />
          )}
        </div>
      </Button>

      <VoiceVisualizer
        {...voiceVisualizerBaseProps}
        backgroundColor="#3A3C3C"
        mainBarColor="#e4e6eb"
        secondaryBarColor="#c8c9cc"
      />
    </div>
  );
};

export default VoiceRecordingDisplay;
