import React, { useEffect, useState, useCallback, useRef } from "react";
import { ItemImage } from "../ItemImage";
import { Mascot, NextArrow } from "../Chrome";
import { shuffle } from "../../lib/content";
import { speak, playCorrect, playTryAgain, playStar } from "../../lib/audio";
import { Volume2 } from "lucide-react";

const ROUND = 10;

// Build ROUND questions, each with a target + 3 distractors.
function buildQuestions(pool) {
  const targets = shuffle(pool).slice(0, Math.min(ROUND, pool.length));
  return targets.map((target) => {
    const distractors = shuffle(pool.filter((x) => x.en !== target.en)).slice(0, 3);
    return { target, options: shuffle([target, ...distractors]) };
  });
}

export function RecognizeTask({ topic, pool, onStar, onFinish }) {
  const [questions] = useState(() => buildQuestions(pool));
  const [idx, setIdx] = useState(0);
  const [wrong, setWrong] = useState(null);
  const [correct, setCorrect] = useState(false);
  const q = questions[idx];

  const playWord = useCallback(() => {
    if (q) speak(q.target.en);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(playWord, 400);
    return () => clearTimeout(t);
  }, [idx, playWord]);

  const handlePick = (opt) => {
    if (correct) return;
    if (opt.en === q.target.en) {
      setCorrect(true);
      playCorrect();
      playStar();
      onStar();
      setTimeout(() => {
        if (idx + 1 >= questions.length) {
          onFinish();
        } else {
          setIdx(idx + 1);
          setCorrect(false);
          setWrong(null);
        }
      }, 950);
    } else {
      setWrong(opt.en);
      playTryAgain();
      setTimeout(() => setWrong(null), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full ket-fade-in">
      <Mascot message="Kuuntele sana ja napauta oikeaa kuvaa!" small />
      <button
        data-testid="audio-listen-button"
        onClick={playWord}
        className="ket-btn flex items-center gap-3 px-8 py-5 font-fredoka font-bold text-2xl text-white ket-bounce-slow"
        style={{ backgroundColor: topic.theme.accent, borderColor: "#00000022" }}
      >
        <Volume2 className="w-9 h-9" strokeWidth={2.5} /> Kuuntele 🔊
      </button>

      <p className="font-fredoka text-slate-400 font-semibold">
        {idx + 1} / {questions.length}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-xl mx-auto w-full ket-stagger">
        {q.options.map((opt) => {
          const isRight = correct && opt.en === q.target.en;
          const isWrong = wrong === opt.en;
          return (
            <button
              key={opt.en}
              data-testid={`recognize-option-${opt.en.replace(/\s+/g, "-")}`}
              onClick={() => handlePick(opt)}
              className={`ket-btn bg-white flex items-center justify-center h-32 sm:h-40 ${
                isWrong ? "ket-shake" : ""
              } ${isRight ? "ket-pop" : ""}`}
              style={{
                borderColor: isRight ? "#15803D" : topic.theme.border,
                backgroundColor: isRight ? "#DCFCE7" : "#fff",
              }}
            >
              <ItemImage item={opt} kind={topic.kind} size="text-6xl sm:text-7xl" />
            </button>
          );
        })}
      </div>

      {correct && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none px-6">
          <div className="ket-pop bg-white/95 backdrop-blur rounded-3xl border-4 border-green-400 shadow-2xl px-10 sm:px-14 py-8 sm:py-10 flex flex-col items-center gap-3">
            <ItemImage item={q.target} kind={topic.kind} size="text-8xl sm:text-9xl" />
            <span className="font-fredoka font-bold text-5xl sm:text-6xl text-green-600">
              {q.target.en}
            </span>
            <span className="font-fredoka font-bold text-2xl text-amber-500">Hienoa! ⭐</span>
          </div>
        </div>
      )}
    </div>
  );
}
