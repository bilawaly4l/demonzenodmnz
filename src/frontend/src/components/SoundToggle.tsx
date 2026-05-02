import { Volume2, VolumeX } from "lucide-react";
import { useSound } from "../contexts/SessionContext";

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <button
      type="button"
      data-ocid="navbar.sound_toggle.toggle"
      onClick={toggleSound}
      aria-label={
        soundEnabled ? "Turn off sound effects" : "Turn on sound effects"
      }
      title={soundEnabled ? "Sound effects: on" : "Sound effects: off"}
      className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
    >
      {soundEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
    </button>
  );
}
