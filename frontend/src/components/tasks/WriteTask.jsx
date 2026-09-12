import React, { useState, useRef, useEffect } from "react";
import { ItemImage } from "../ItemImage";
import { Mascot, NextArrow } from "../Chrome";
import { shuffle } from "../../lib/content";
import { speak, playStar, playCorrect } from "../../lib/audio";
import { Lightbulb } from "lucide-react";

const ROUND = 10;

// Type-the-word task. Correct prefix turns green live; case-insensitive.
export function WriteTask({ topic, pool, onStar, onFinish }) {
  const [words] = useState(() => shuffle(pool).slice(0, Math.min(ROUND, pool.length)));
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [hint, setHint] = useState(false);
  const inputRef = useRef(null);
  const starredRef = useRef(false);

  const item = words[idx];
  const target = item.en;
  const targetLC = target.toLowerCase();

  useEffect(() => {
    setTyped("");
    setDone(false);
    setHint(false);
    starredRef.current = false;
    const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 300);
    return () => clearTimeout(t);
  }, [idx]);

  const handleChange = (e) => {
    if (done) return;
    const val = e.target.value;
    setTyped(val);
    if (val.toLowerCase() === targetLC) {
      setDone(true);
      speak(target);
      playCorrect();
      playStar();
      if (!starredRef.current) { starredRef.current = true; onStar(); }
    }
  };

  const showHint = () => {
    setHint(true);
    speak(target);
    setTimeout(() => setHint(false), 1600);
  };

  const next = () => {
    if (idx + 1 >= words.length) onFinish();
    else setIdx(idx + 1);
  };

  // Build the per-letter tiles reflecting live correctness.
  const chars = target.split("");
  let prefixOk = true;

  return (
    <div className="flex flex-col items-center gap-5 w-full ket-fade-in">
      <Mascot message="Kirjoita sana kuvan mukaan — oikeat kirjaimet muuttuvat vihreiksi!" small />
      <p className="font-fredoka text-slate-400 font-semibold">{idx + 1} / {words.length}</p>

      <div
        className="bg-white rounded-3xl border-4 shadow-lg flex flex-col items-center justify-center gap-2 p-8 w-full max-w-sm ket-pop"
        style={{ borderColor: topic.theme.border }}
      >
        <ItemImage item={item} kind={topic.kind} />
        <span className="text-slate-400 font-semibold text-lg mt-1">{item.fi}</span>
        {hint && (
          <span className="font-fredoka font-bold text-2xl text-amber-500 ket-pop tracking-widest">
            {target}
          </span>
        )}
      </div>

      {/* Letter tiles */}
      <div className="flex flex-wrap gap-1.5 justify-center max-w-lg" data-testid="write-letter-tiles">
        {chars.map((ch, i) => {
          const t = typed[i];
          const isSpace = ch === " ";
          const matches = t && t.toLowerCase() === ch.toLowerCase() && prefixOk;
          if (t && t.toLowerCase() !== ch.toLowerCase()) prefixOk = false;
          if (isSpace) return <span key={i} className="w-3" />;
          return (
            <span
              key={i}
              className="w-9 h-11 sm:w-10 sm:h-12 flex items-center justify-center rounded-lg border-2 font-fredoka font-bold text-2xl uppercase transition-colors"
              style={{
                borderColor: matches ? "#15803D" : "#CBD5E1",
                backgroundColor: matches ? "#DCFCE7" : "#F8FAFC",
                color: matches ? "#15803D" : "#94A3B8",
              }}
            >
              {t ? t : ""}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        data-testid="letter-input"
        type="text"
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        value={typed}
        onChange={handleChange}
        disabled={done}
        placeholder="Kirjoita tähän…"
        className="w-full max-w-xs px-5 py-4 rounded-2xl border-4 font-fredoka font-bold text-xl text-center bg-white outline-none"
        style={{ borderColor: done ? "#15803D" : topic.theme.border, color: done ? "#15803D" : "#1E293B" }}
      />

      <div className="flex items-center gap-3 flex-wrap justify-center">
        <button
          data-testid="hint-button"
          onClick={showHint}
          className="ket-btn flex items-center gap-2 px-5 py-3 font-fredoka font-bold text-lg"
          style={{ backgroundColor: "#FACC15", borderColor: "#D97706", color: "#78350F" }}
        >
          <Lightbulb className="w-6 h-6" /> Vihje
        </button>
        {done && (
          <NextArrow onClick={next} label={idx + 1 >= words.length ? "Valmis" : "Seuraava"} />
        )}
      </div>

      {done && (
        <div className="font-fredoka font-bold text-2xl text-green-600 ket-pop">Oikein! ⭐</div>
      )}
    </div>
  );
}
