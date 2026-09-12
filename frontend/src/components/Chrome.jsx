import React from "react";
import { ArrowLeft, Volume2, VolumeX, Star, Settings } from "lucide-react";

export function Header({ title, accent, onBack, canBack, stars, muted, onToggleMute, onOpenSettings }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-4 border-amber-200 rounded-b-3xl shadow-sm">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
        <button
          data-testid="back-button"
          onClick={onBack}
          disabled={!canBack}
          className="ket-btn flex items-center gap-1.5 px-4 py-2.5 font-fredoka font-semibold text-base sm:text-lg text-white shrink-0"
          style={{
            backgroundColor: canBack ? "#FB7185" : "#E2E8F0",
            borderColor: canBack ? "#BE123C" : "#CBD5E1",
            color: canBack ? "#fff" : "#94A3B8",
          }}
          aria-label="Takaisin"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={3} />
          <span className="hidden xs:inline sm:inline">Takaisin</span>
        </button>

        <h1
          className="font-fredoka font-bold text-lg sm:text-2xl truncate text-center flex-1"
          style={{ color: accent || "#1E293B" }}
        >
          {title}
        </h1>

        <div className="flex items-center gap-2 shrink-0">
          <div
            data-testid="star-rewards-counter"
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-amber-100 border-2 border-amber-300 font-fredoka font-bold text-amber-700 text-base sm:text-lg"
          >
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
            {stars}
          </div>
          <button
            data-testid="mute-toggle"
            onClick={onToggleMute}
            className="ket-btn p-2.5 bg-white"
            style={{ borderColor: "#FBBF24" }}
            aria-label={muted ? "Ääni pois" : "Ääni päällä"}
          >
            {muted ? (
              <VolumeX className="w-6 h-6 text-slate-400" strokeWidth={2.5} />
            ) : (
              <Volume2 className="w-6 h-6 text-amber-500" strokeWidth={2.5} />
            )}
          </button>
          <button
            data-testid="open-settings-button"
            onClick={onOpenSettings}
            className="ket-btn p-2.5 bg-white"
            style={{ borderColor: "#FBBF24" }}
            aria-label="Asetukset"
          >
            <Settings className="w-6 h-6 text-slate-500" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
}

export function Mascot({ message, small }) {
  return (
    <div className="flex items-center gap-3 justify-center">
      <div
        className={`ket-bounce-slow bg-green-100 rounded-full border-4 border-green-400 flex items-center justify-center shadow-md shrink-0 ${
          small ? "w-12 h-12 text-2xl" : "w-16 h-16 sm:w-20 sm:h-20 text-3xl sm:text-4xl"
        }`}
      >
        🐸
      </div>
      {message && (
        <div className="bg-white border-4 border-amber-300 rounded-2xl px-4 py-2.5 shadow-md font-bold text-slate-700 text-base sm:text-lg max-w-md">
          {message}
        </div>
      )}
    </div>
  );
}

// Big pill forward arrow (replaces the old bottom "next words" text button).
export function NextArrow({ onClick, label = "Seuraava", disabled }) {
  return (
    <button
      data-testid="next-word-button"
      onClick={onClick}
      disabled={disabled}
      className="ket-btn inline-flex items-center gap-2 px-7 py-4 font-fredoka font-bold text-xl sm:text-2xl text-white"
      style={{ backgroundColor: "#38BDF8", borderColor: "#0284C7" }}
    >
      <span>{label}</span>
      <span className="text-3xl leading-none">→</span>
    </button>
  );
}
