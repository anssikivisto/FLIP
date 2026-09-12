import React, { useState, useEffect } from "react";
import { ItemImage } from "../ItemImage";
import { Mascot, NextArrow } from "../Chrome";
import { speak } from "../../lib/audio";
import { Volume2, ArrowLeft } from "lucide-react";

// Flashcards review mode: present every word one at a time. NO stars awarded.
export function FlashcardsTask({ topic, pool, onFinish }) {
  const [idx, setIdx] = useState(0);
  const item = pool[idx];
  const last = idx + 1 >= pool.length;

  useEffect(() => {
    const t = setTimeout(() => speak(item.en), 350);
    return () => clearTimeout(t);
  }, [idx, item.en]);

  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => {
    if (last) onFinish();
    else setIdx((i) => i + 1);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full ket-fade-in">
      <Mascot message="Kertaa sanat rauhassa – ei tähtiä, vain harjoittelua!" small />
      <p className="font-fredoka text-slate-400 font-semibold">
        {idx + 1} / {pool.length}
      </p>

      <div
        key={idx}
        className="bg-white rounded-3xl border-4 shadow-lg flex flex-col items-center justify-center gap-3 p-8 sm:p-10 w-full max-w-sm ket-pop"
        style={{ borderColor: topic.theme.border }}
      >
        <ItemImage item={item} kind={topic.kind} />
        <button
          data-testid="audio-listen-button"
          onClick={() => speak(item.en)}
          className="flex items-center gap-2 font-fredoka font-bold text-3xl sm:text-4xl mt-2"
          style={{ color: topic.theme.accent }}
        >
          <Volume2 className="w-8 h-8" /> {item.en}
        </button>
        <span className="text-slate-400 font-semibold text-xl">{item.fi}</span>
      </div>

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          data-testid="flashcard-prev-button"
          onClick={prev}
          disabled={idx === 0}
          className="ket-btn flex items-center gap-1.5 px-5 py-4 font-fredoka font-bold text-lg bg-white"
          style={{ borderColor: "#CBD5E1", color: "#475569" }}
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={3} /> Edellinen
        </button>
        <NextArrow onClick={next} label={last ? "Valmis" : "Seuraava"} />
      </div>
    </div>
  );
}
