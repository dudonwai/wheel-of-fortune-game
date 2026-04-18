import { useEffect, useRef, useState, useCallback } from "react";
import { WHEEL_SEGMENTS, getSegmentColor, getSegmentLabel, getSegmentTextColor, type WheelResult } from "./types";
import { playTickSound } from "./sounds";

interface WheelProps {
  onSpinComplete: (result: WheelResult) => void;
  spinning: boolean;
  onSpinStart: () => void;
  disabled: boolean;
}

function secureRandom(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] / 4294967295;
}

export function Wheel({ onSpinComplete, spinning, onSpinStart, disabled }: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const lastTickAngle = useRef(0);

  const segments = WHEEL_SEGMENTS;
  const segmentAngle = 360 / segments.length;

  const drawWheel = useCallback(
    (currentRotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = canvas.width;
      const center = size / 2;
      const radius = center - 8;

      ctx.clearRect(0, 0, size, size);

      // Draw outer ring
      ctx.beginPath();
      ctx.arc(center, center, radius + 4, 0, 2 * Math.PI);
      ctx.strokeStyle = "#F5C518";
      ctx.lineWidth = 4;
      ctx.stroke();

      segments.forEach((segment, i) => {
        const startAngle = ((i * segmentAngle - 90 + currentRotation) * Math.PI) / 180;
        const endAngle = (((i + 1) * segmentAngle - 90 + currentRotation) * Math.PI) / 180;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = getSegmentColor(segment);
        ctx.fill();
        ctx.strokeStyle = "#0A1628";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        const midAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.68;
        const textX = center + textRadius * Math.cos(midAngle);
        const textY = center + textRadius * Math.sin(midAngle);

        ctx.save();
        ctx.translate(textX, textY);
        ctx.rotate(midAngle + Math.PI / 2);
        ctx.fillStyle = getSegmentTextColor(segment);
        ctx.font = "bold 11px Oswald, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const label = getSegmentLabel(segment);
        if (label.length > 6) {
          const words = label.split(" ");
          words.forEach((word, wi) => {
            ctx.fillText(word, 0, (wi - (words.length - 1) / 2) * 12);
          });
        } else {
          ctx.fillText(label, 0, 0);
        }
        ctx.restore();
      });

      // Center hub
      ctx.beginPath();
      ctx.arc(center, center, 18, 0, 2 * Math.PI);
      ctx.fillStyle = "#F5C518";
      ctx.fill();
      ctx.strokeStyle = "#0A1628";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pointer (top)
      ctx.beginPath();
      ctx.moveTo(center, 6);
      ctx.lineTo(center - 12, -6);
      ctx.lineTo(center + 12, -6);
      ctx.closePath();
      ctx.fillStyle = "#F5C518";
      ctx.fill();
      ctx.strokeStyle = "#0A1628";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    [segments, segmentAngle],
  );

  // Draw the wheel whenever rotation changes
  useEffect(() => {
    drawWheel(rotation);
  }, [rotation, drawWheel]);

  // Handle spin animation
  useEffect(() => {
    if (!spinning || isAnimating) return;

    setIsAnimating(true);

    // Determine where we want to land
    const targetSegmentIndex = Math.floor(secureRandom() * segments.length);
    // We want at least 5 full rotations + landing angle
    const totalRotation = 360 * (5 + secureRandom() * 3) + (360 - targetSegmentIndex * segmentAngle - segmentAngle / 2);

    const startRotation = rotation;
    const endRotation = startRotation + totalRotation;
    const duration = 3500 + secureRandom() * 1500; // 3.5-5 seconds
    const startTime = performance.now();

    lastTickAngle.current = startRotation;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentRot = startRotation + totalRotation * eased;

      setRotation(currentRot % 360);

      // Tick sound
      const angleDelta = Math.abs(currentRot - lastTickAngle.current);
      if (angleDelta >= segmentAngle) {
        playTickSound();
        lastTickAngle.current = currentRot;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        // Calculate which segment the pointer is on
        const normalizedAngle = (((360 - (endRotation % 360)) % 360) + 360) % 360;
        const landedIndex = Math.floor(normalizedAngle / segmentAngle) % segments.length;
        onSpinComplete(segments[landedIndex]);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinning]);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        style={{ width: 280, height: 280 }}
        aria-label="Wheel of Fortune spinning wheel"
      />
      <button
        onClick={onSpinStart}
        disabled={disabled || isAnimating}
        className="w-full py-2 px-4 rounded font-bold text-sm uppercase tracking-wider transition-all"
        style={{
          fontFamily: "Oswald, sans-serif",
          backgroundColor: disabled || isAnimating ? "#333" : "#F5C518",
          color: disabled || isAnimating ? "#666" : "#0A1628",
          cursor: disabled || isAnimating ? "not-allowed" : "pointer",
          letterSpacing: "0.04em",
        }}
      >
        {isAnimating ? "Spinning..." : "Spin the Wheel"}
      </button>
    </div>
  );
}
