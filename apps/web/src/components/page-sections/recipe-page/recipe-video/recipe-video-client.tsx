"use client";

import MuxPlayer from "@mux/mux-player-react";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type Props = {
  playbackId: string;
  posterUrl?: string | null;
  metaTitle?: string | null;
  ariaLabel?: string;
  className?: string;
};

function VideoErrorFallback({
  posterUrl,
  onRetry,
}: {
  posterUrl?: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-md bg-muted flex flex-col items-center justify-center p-6">
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt="Video poster"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : null}
      <div className="relative z-10 flex flex-col items-center text-center space-y-4 bg-background/90 p-6 rounded-lg">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground max-w-md">
          Unable to load the video. You can try again or view the recipe details
          below.
        </p>
        <Button onClick={onRetry} variant="outline" size="sm">
          <Play className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

export function RecipeVideoClient({
  playbackId,
  posterUrl,
  metaTitle,
  ariaLabel,
  className,
}: Props) {
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const metadata = metaTitle ? { video_title: metaTitle } : undefined;

  const handleError = () => {
    console.error("Video playback error:", { playbackId, metaTitle });
    setHasError(true);
  };

  const handleRetry = () => {
    setHasError(false);
    setRetryKey((prev) => prev + 1);
  };

  // Validate playbackId before rendering
  if (!playbackId || playbackId.trim() === "") {
    return (
      <div className={className} {...(ariaLabel ? { role: "region" } : {})}>
        <VideoErrorFallback posterUrl={posterUrl} onRetry={() => {}} />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={className} {...(ariaLabel ? { role: "region" } : {})}>
        <VideoErrorFallback posterUrl={posterUrl} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className={className} {...(ariaLabel ? { role: "region" } : {})}>
      <div className="relative w-full aspect-video overflow-hidden rounded-md bg-muted">
        <MuxPlayer
          key={retryKey} // Force re-mount on retry
          playbackId={playbackId}
          streamType="on-demand"
          poster={posterUrl || undefined}
          metadata={metadata}
          aria-label={ariaLabel}
          title={metaTitle || undefined}
          style={{ width: "100%", height: "100%" }}
          onError={handleError}
        />
      </div>
    </div>
  );
}
