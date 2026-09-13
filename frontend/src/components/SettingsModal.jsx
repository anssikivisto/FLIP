import React, { useState } from "react";
import { getVoiceSettings, setVoiceSettings, speak } from "../lib/audio";
import { X, Volume2 } from "lucide-react";

export function SettingsModal({ onClose }) {
  const initial = getVoiceSettings();
  const [rate, setRate] = useState(initial.rate);

  const changeRate = (r) => {
    setRate(r);
    setVoiceSettings({ rate: r });
  };

  const testVoice = () => speak("Hello, let's learn English!");

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-5"
      data-testid="settings-modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="ket-pop bg-white rounded-3xl border-4 border-sky-300 shadow-2xl w-full max-w-md p-6 sm:p-8"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-fredoka font-bold text-2xl text-slate-700">Ääniasetukset ⚙️</h2>
          <button
            data-testid="settings-close-button"
            onClick={onClose}
            className="ket-btn p-2 bg-white"
            style={{ borderColor: "#CBD5E1" }}
            aria-label="Sulje"
          >
            <X className="w-6 h-6 text-slate-500" strokeWidth={3} />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-5 rounded-2xl bg-sky-50 border-2 border-sky-200 px-4 py-3">
          <span className="text-2xl">🎙️</span>
          <p className="font-fredoka font-bold text-slate-500 text-sm">
            Sanat luetaan laadukkaalla tekoälyäänellä (Nova).
          </p>
        </div>

        <p className="font-fredoka font-bold text-slate-500 mb-2">Puheen nopeus</p>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🐢</span>
          <input
            data-testid="rate-slider"
            type="range"
            min="0.5"
            max="1.3"
            step="0.05"
            value={rate}
            onChange={(e) => changeRate(parseFloat(e.target.value))}
            className="flex-1 h-3 rounded-full accent-sky-500 cursor-pointer"
          />
          <span className="text-2xl">🐇</span>
        </div>
        <p className="text-center font-fredoka font-bold text-slate-400 mb-6">
          {rate.toFixed(2)}×
        </p>

        <button
          data-testid="test-voice-button"
          onClick={testVoice}
          className="ket-btn w-full flex items-center justify-center gap-2 py-4 font-fredoka font-bold text-xl text-white"
          style={{ backgroundColor: "#4ADE80", borderColor: "#15803D" }}
        >
          <Volume2 className="w-7 h-7" /> Kokeile ääntä
        </button>
      </div>
    </div>
  );
}
