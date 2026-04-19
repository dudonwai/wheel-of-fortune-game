import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Toggle play/pause state
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Play might fail if browser auto-play policy blocks it, but it should be fine here since it's a user interaction
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Ensure volume is set correctly
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Background music shouldn't be too loud
    }
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        loop
        src="/theme.mp3"
        onError={(e) => {
          console.warn("Audio failed to load. Please make sure you have placed a 'theme.mp3' file in your public folder!");
        }}
      />
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-lg"
        style={{
          backgroundColor: isPlaying ? "rgba(245, 197, 24, 0.9)" : "rgba(10, 22, 40, 0.8)",
          color: isPlaying ? "#0A1628" : "#F5C518",
          border: isPlaying ? "none" : "1px solid rgba(245, 197, 24, 0.5)",
          backdropFilter: "blur(4px)",
          cursor: "pointer",
        }}
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        aria-label={isPlaying ? "Mute Background Music" : "Play Background Music"}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
    </>
  );
}
