"use client";

import MuxPlayer from "@mux/mux-player-react";

type Props = {
  playbackId: string;
  posterUrl?: string | null;
  metaTitle?: string | null;
  ariaLabel?: string;
  className?: string;
};

export function RecipeVideoClient({
  playbackId,
  posterUrl,
  metaTitle,
  ariaLabel,
  className,
}: Props) {
  const metadata = metaTitle ? { video_title: metaTitle } : undefined;

  return (
    <div className={className} {...(ariaLabel ? { role: "region" } : {})}>
      <div className="relative w-full aspect-video overflow-hidden rounded-md bg-muted">
        <MuxPlayer
          playbackId={playbackId}
          streamType="on-demand"
          poster={posterUrl || undefined}
          metadata={metadata}
          aria-label={ariaLabel}
          title={metaTitle || undefined}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
