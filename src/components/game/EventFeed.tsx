import { ScrollArea } from "@/components/ui/scroll-area";
import type { FeedEntry, FeedEventType } from "./types";

interface EventFeedProps {
  events: FeedEntry[];
}

function getEventStyle(type: FeedEventType): { color: string; fontWeight: number; icon: string } {
  switch (type) {
    case "bankrupt":
      return { color: "#EF4444", fontWeight: 700, icon: "\u26A0" };
    case "loseTurn":
      return { color: "#F59E0B", fontWeight: 600, icon: "\u23ED" };
    case "correctGuess":
      return { color: "#34D399", fontWeight: 500, icon: "\u2713" };
    case "wrongGuess":
      return { color: "rgba(255,255,255,0.4)", fontWeight: 400, icon: "\u2717" };
    case "buyVowel":
      return { color: "#A78BFA", fontWeight: 500, icon: "\u0024" };
    case "solve":
      return { color: "#F5C518", fontWeight: 700, icon: "\u2605" };
    case "wrongSolve":
      return { color: "#EF4444", fontWeight: 500, icon: "\u2717" };
    case "roundWin":
      return { color: "#F5C518", fontWeight: 700, icon: "\uD83C\uDFC6" };
    case "spin":
      return { color: "rgba(255,255,255,0.7)", fontWeight: 400, icon: "\uD83C\uDFA1" };
    case "turnChange":
      return { color: "rgba(255,255,255,0.5)", fontWeight: 400, icon: "\u25B6" };
    default:
      return { color: "rgba(255,255,255,0.6)", fontWeight: 400, icon: "\u2022" };
  }
}

export function EventFeed({ events }: EventFeedProps) {
  if (events.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded"
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: 13,
          color: "rgba(255,255,255,0.25)",
          padding: "12px 8px",
          backgroundColor: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        Events will appear here
      </div>
    );
  }

  return (
    <div
      className="flex flex-col rounded h-full"
      style={{
        backgroundColor: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontFamily: "Oswald, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          padding: "6px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        Event Log
      </div>

      {/* Scrollable feed */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col" style={{ padding: "4px 0" }}>
          {events.map(event => {
            const style = getEventStyle(event.type);
            const isBankrupt = event.type === "bankrupt";

            return (
              <div
                key={event.id}
                className="flex items-start gap-2 transition-colors"
                style={{
                  padding: "4px 10px",
                  backgroundColor: isBankrupt ? "rgba(239, 68, 68, 0.08)" : "transparent",
                  borderLeft: isBankrupt ? "2px solid #EF4444" : "2px solid transparent",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    lineHeight: "18px",
                    flexShrink: 0,
                    width: 16,
                    textAlign: "center",
                  }}
                  aria-hidden="true"
                >
                  {style.icon}
                </span>
                <span
                  style={{
                    fontFamily: "Archivo, sans-serif",
                    fontSize: 13,
                    fontWeight: style.fontWeight,
                    color: style.color,
                    lineHeight: "18px",
                    letterSpacing: "0.01em",
                  }}
                >
                  {event.text}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
