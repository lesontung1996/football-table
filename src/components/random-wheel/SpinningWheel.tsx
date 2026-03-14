import { useCallback, useEffect, useRef, useState } from "react";
import type { Team } from "@/lib/random-wheel/types";
import { getImageProps } from "next/image";
import useWindowWidth from "@/hooks/useWindowWidth";
import { cn } from "@/lib/utils";

const SLICE_COLORS = ["#22c55e", "#eab308", "#ef4444", "#3b82f6"];
const SPIN_DURATION_MS = 6000;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeSlice(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngleDeg: number,
  endAngleDeg: number,
) {
  const start = polarToCartesian(cx, cy, outerR, startAngleDeg);
  const end = polarToCartesian(cx, cy, outerR, endAngleDeg);
  const startInner = polarToCartesian(cx, cy, innerR, startAngleDeg);
  const endInner = polarToCartesian(cx, cy, innerR, endAngleDeg);
  const largeArc = endAngleDeg - startAngleDeg > 180 ? 1 : 0;
  return [
    `M ${startInner.x} ${startInner.y}`,
    `L ${start.x} ${start.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

interface SpinningWheelProps {
  teams: Team[];
  rotation: number;
  isSpinning: boolean;
  onSpinEnd?: () => void;
  onClick?: () => void;
  "aria-label"?: string;
}

export default function SpinningWheel({
  teams,
  rotation,
  isSpinning,
  onSpinEnd,
  onClick,
  "aria-label": ariaLabel,
}: SpinningWheelProps) {
  const hasTransition = useRef(false);
  const windowWidth = useWindowWidth();
  const [spinedOnce, setSpinedOnce] = useState(false);

  let WHEEL_SIZE;
  if (windowWidth >= 1024) {
    WHEEL_SIZE = 400;
  } else if (windowWidth >= 768) {
    WHEEL_SIZE = 300;
  } else {
    WHEEL_SIZE = Math.min(400, Math.max(260, windowWidth - 120));
  }
  const CX = WHEEL_SIZE / 2;
  const CY = WHEEL_SIZE / 2;
  const OUTER_R = WHEEL_SIZE / 2 - 8;
  const INNER_R = windowWidth >= 1024 ? 50 : 36;

  let logoSize, logoR, fontSize;
  if (windowWidth >= 1024) {
    logoSize = 32;
    logoR = OUTER_R - 25;
    fontSize = 15;
  } else if (windowWidth >= 768) {
    logoSize = 24;
    logoR = OUTER_R - 22;
    fontSize = 14;
  } else {
    logoSize = WHEEL_SIZE * 0.06;
    logoR = OUTER_R - logoSize;
    fontSize = 12;
  }
  const sliceAngle = 360 / teams.length;
  const textR = (INNER_R + OUTER_R) / 2 - 10;

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.propertyName !== "transform" || !hasTransition.current) return;
      hasTransition.current = false;
      onSpinEnd?.();
    },
    [onSpinEnd],
  );

  useEffect(() => {
    if (isSpinning) {
      hasTransition.current = true;
      setSpinedOnce(true);
    }
  }, [isSpinning]);

  if (teams.length === 0) {
    return (
      <div
        className={`relative flex flex-shrink-0 items-center justify-center rounded-full bg-fpl-1000`}
        aria-label={ariaLabel}
        style={{
          width: WHEEL_SIZE,
          height: WHEEL_SIZE,
        }}
      >
        <span className="text-sm text-white/60">No teams</span>
      </div>
    );
  }

  const getNextImageProps = (team: Team) => {
    const { props } = getImageProps({
      src: team.logoRef,
      alt: team.name,
      width: logoSize * 2,
      height: logoSize * 2,
    });
    return props;
  };

  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-center"
      role="img"
      aria-label={ariaLabel ?? "Spinning wheel"}
    >
      <button
        type="button"
        onClick={onClick}
        className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-fpl-accent focus:ring-offset-2 focus:ring-offset-fpl-1100 disabled:pointer-events-none"
        disabled={isSpinning}
        aria-label="Spin the wheel"
      >
        <span
          className={`max-w-[70%] text-center text-xs font-semibold text-fpl-1200 transition-all ${
            isSpinning ? "opacity-0 invisible" : "opacity-100 visible"
          }`}
        >
          Click to <br />
          spin
        </span>
      </button>

      <div
        className="relative"
        style={{
          width: WHEEL_SIZE,
          height: WHEEL_SIZE,
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,0,0,0.4)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(.25, .8, .50, 1)`
              : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <svg
            width={WHEEL_SIZE}
            height={WHEEL_SIZE}
            viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
            className={cn(
              "overflow-visible",
              !isSpinning && !spinedOnce && "animate-spin-slow",
            )}
          >
            <defs>
              <clipPath id="circle-clip">
                <circle r={logoSize / 2} cx="0" cy="0" />
              </clipPath>
            </defs>
            {teams.map((team, i) => {
              const startAngle = i * sliceAngle;
              const endAngle = (i + 1) * sliceAngle;
              const midAngle = (startAngle + endAngle) / 2;
              const color = SLICE_COLORS[i % SLICE_COLORS.length];
              const textPos = polarToCartesian(CX, CY, textR, midAngle);
              const textRotation = midAngle - 90;
              const logoPos = polarToCartesian(CX, CY, logoR, midAngle);

              return (
                <g key={team.id}>
                  <path
                    d={describeSlice(
                      CX,
                      CY,
                      INNER_R,
                      OUTER_R,
                      startAngle,
                      endAngle,
                    )}
                    fill={color}
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth={1}
                  />
                  <g
                    transform={`translate(${logoPos.x} ${logoPos.y})`}
                    style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
                  >
                    <image
                      href={getNextImageProps(team).src}
                      x={-logoSize / 2}
                      y={-logoSize / 2}
                      width={logoSize}
                      height={logoSize}
                      preserveAspectRatio="xMidYMid slice"
                      transform={`rotate(${textRotation})`}
                    />
                  </g>
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={fontSize}
                    fontWeight="600"
                    transform={`rotate(${textRotation} ${textPos.x} ${textPos.y})`}
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {team.tla}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div
          className="absolute rounded-full bg-white shadow-[inset_0_0_8px_rgba(0,0,0,0.2)]"
          style={{
            width: INNER_R * 2,
            height: INNER_R * 2,
            left: CX - INNER_R,
            top: CY - INNER_R,
            pointerEvents: "none",
          }}
        />

        <div
          className="absolute right-1 top-1/2 z-20 -translate-y-1/2 translate-x-1"
          style={{ pointerEvents: "none" }}
          aria-hidden
        >
          <div
            className="border-y-8 border-r-[14px] border-y-transparent border-r-white"
            style={{ width: 0, height: 0 }}
          />
        </div>
      </div>
    </div>
  );
}
