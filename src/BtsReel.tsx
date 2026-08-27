import { Fragment } from "react";
import {
  AbsoluteFill,
  Composition,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

const FPS = 30;
const TRANSITION_DURATION = 15;

const clips = [
  {
    src: staticFile("videos/clip-1-setup.mp4"),
    durationInFrames: 175,
    zoom: "in" as const,
  },
  {
    src: staticFile("videos/clip-2-touchup.mp4"),
    durationInFrames: 108,
    zoom: "out" as const,
  },
  {
    src: staticFile("videos/clip-3-shooting.mp4"),
    durationInFrames: 234,
    zoom: "in" as const,
  },
  {
    src: staticFile("videos/clip-4-reviewing.mp4"),
    durationInFrames: 149,
    zoom: "out" as const,
  },
  {
    src: staticFile("videos/clip-5-hero.mp4"),
    durationInFrames: 69,
    zoom: "in" as const,
  },
];

const TOTAL_DURATION =
  clips.reduce((sum, clip) => sum + clip.durationInFrames, 0) -
  (clips.length - 1) * TRANSITION_DURATION;

const ClipScene: React.FC<{
  src: string;
  durationInFrames: number;
  zoom: "in" | "out";
}> = ({ src, durationInFrames, zoom }) => {
  const frame = useCurrentFrame();

  const scale =
    zoom === "in"
      ? interpolate(frame, [0, durationInFrames], [1, 1.1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.ease),
        })
      : interpolate(frame, [0, durationInFrames], [1.1, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.inOut(Easing.ease),
        });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          filter: "contrast(1.08) saturate(0.9) brightness(1.03)",
        }}
      >
        <OffthreadVideo src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      boxShadow: "inset 0 0 220px 40px rgba(0,0,0,0.55)",
    }}
  />
);

const Grain: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity: 0.05,
      mixBlendMode: "overlay",
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
    }}
  />
);

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [10, 30, 55, 75], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [10, 30], [16, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame > 75) return null;

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 180,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: 6,
            textTransform: "uppercase",
            textShadow: "0 2px 24px rgba(0,0,0,0.6)",
          }}
        >
          Behind The Scenes
        </div>
        <div
          style={{
            marginTop: 10,
            color: "rgba(255,255,255,0.75)",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          Studio Shoot
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BtsReelComposition = () => {
  return (
    <Composition
      id="BtsReel"
      component={BtsReel}
      durationInFrames={TOTAL_DURATION}
      fps={FPS}
      width={1080}
      height={1920}
    />
  );
};

export const BtsReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        {clips.map((clip, index) => {
          const isLast = index === clips.length - 1;
          return (
            <Fragment key={clip.src}>
              <TransitionSeries.Sequence durationInFrames={clip.durationInFrames}>
                <ClipScene
                  src={clip.src}
                  durationInFrames={clip.durationInFrames}
                  zoom={clip.zoom}
                />
              </TransitionSeries.Sequence>
              {!isLast && (
                <TransitionSeries.Transition
                  presentation={index % 2 === 0 ? fade() : slide({ direction: "from-right" })}
                  timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
                />
              )}
            </Fragment>
          );
        })}
      </TransitionSeries>
      <Vignette />
      <Grain />
      <TitleCard />
    </AbsoluteFill>
  );
};
