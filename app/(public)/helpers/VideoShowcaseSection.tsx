"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

// Full-screen autoplay video section — same muted/loop/playsInline pattern
// as the our-story and skin-education hero videos, packaged so any video in
// the project can get its own landing-page moment without duplicating the
// autoplay/fallback/reduced-motion logic per section.
export default function VideoShowcaseSection({
  src,
  poster,
  eyebrow,
  heading,
  subtext,
}: {
  src: string;
  poster: string;
  eyebrow: string;
  heading: string;
  subtext: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  // The caption only makes sense while there's no footage on screen yet
  // (loading, or the poster/fallback image) — once the video is actually
  // playing, it should speak for itself.
  const showCaption = videoFailed || !videoPlaying;

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) videoRef.current?.pause();
  }, []);

  return (
    <section className="relative w-full h-[100dvh] min-h-[520px] overflow-hidden bg-[#10160f]">
      {videoFailed ? (
        <Image src={poster} alt={heading} fill className="object-cover" />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted={muted}
          loop
          playsInline
          // Without this, browsers default to preload="metadata" — just
          // enough to grab dimensions/poster, not the actual footage — so
          // the video was still fetching by the time scroll brought it into
          // view. "auto" tells the browser to start downloading the full
          // file as soon as this element mounts, not when it's on screen.
          preload="auto"
          onError={() => setVideoFailed(true)}
          onPlaying={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
          onWaiting={() => setVideoPlaying(false)}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-[#10160f]/55 via-[#10160f]/15 to-[#10160f]/65 pointer-events-none" />

      <div
        className={`relative z-10 h-full flex flex-col items-center justify-center text-center px-6 transition-opacity duration-700 ${
          showCaption ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-[#c7ecc9] mb-5">
          {eyebrow}
        </p>
        <h2 className="text-[clamp(2rem,5.5vw,4rem)] font-light tracking-wide text-white leading-tight max-w-2xl">
          {heading}
        </h2>
        <p className="mt-5 text-white/75 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          {subtext}
        </p>
      </div>

      {!videoFailed && (
        <button
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-6 right-6 z-10 w-11 h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}
    </section>
  );
}
