import React, { useState } from "react";
import { ItemImage } from "../ItemImage";
import { Mascot } from "../Chrome";
import { shuffle } from "../../lib/content";
import { speak, playCorrect, playTryAgain, playStar } from "../../lib/audio";
import { CheckCircle2 } from "lucide-react";

const BATCH = 4;

function buildBatches(pool) {
  const picked = shuffle(pool);
  const batches = [];
  for (let i = 0; i < picked.length; i += BATCH) {
    batches.push(picked.slice(i, i + BATCH));
  }
  return batches;
}

export function MatchTask({ topic, pool, onStar, onFinish }) {
  const [batches] = useState(() => buildBatches(pool));
  const [bi, setBi] = useState(0);
  const [words, setWords] = useState(() => shuffle(batches[0]));
  const [images, setImages] = useState(() => shuffle(batches[0]));
  const [selectedWord, setSelectedWord] = useState(null);
  const [matched, setMatched] = useState({});
  const [wrongImg, setWrongImg] = useState(null);

  const current = batches[bi];
  const allMatched = current.every((it) => matched[it.en]);

  const advance = () => {
    if (bi + 1 >= batches.length) {
      onFinish();
    } else {
      const next = bi + 1;
      setBi(next);
      setWords(shuffle(batches[next]));
      setImages(shuffle(batches[next]));
      setSelectedWord(null);
      setMatched({});
    }
  };

  const tryMatch = (wordEn, imgEn) => {
    if (matched[imgEn]) return;
    if (wordEn === imgEn) {
      const m = { ...matched, [imgEn]: true };
      setMatched(m);
      setSelectedWord(null);
      speak(imgEn);
      playCorrect();
      playStar();
      onStar();
      if (current.every((it) => m[it.en])) {
        setTimeout(advance, 1000);
      }
    } else {
      setWrongImg(imgEn);
      playTryAgain();
      setTimeout(() => setWrongImg(null), 450);
    }
  };

  const onImageActivate = (img) => {
    if (selectedWord) tryMatch(selectedWord, img.en);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full ket-fade-in">
      <Mascot message="Napauta sana, sitten oikea kuva — tai raahaa!" small />
      <p className="font-fredoka text-slate-400 font-semibold">
        Osa {bi + 1} / {batches.length}
      </p>

      <div className="grid grid-cols-2 gap-5 sm:gap-8 w-full max-w-3xl mx-auto">
        {/* Words */}
        <div className="flex flex-col gap-3 ket-stagger">
          {words.map((w) => {
            const done = matched[w.en];
            const active = selectedWord === w.en;
            return (
              <button
                key={w.en}
                data-testid={`match-word-${w.en.replace(/\s+/g, "-")}`}
                draggable={!done}
                onDragStart={(e) => e.dataTransfer.setData("text/plain", w.en)}
                onClick={() => !done && setSelectedWord(active ? null : w.en)}
                disabled={done}
                className={`ket-btn px-4 py-4 font-fredoka font-bold text-xl sm:text-2xl text-center ${
                  done ? "opacity-40" : ""
                }`}
                style={{
                  backgroundColor: active ? topic.theme.accent : "#fff",
                  color: active ? "#fff" : "#1E293B",
                  borderColor: topic.theme.border,
                }}
              >
                {w.en}
              </button>
            );
          })}
        </div>

        {/* Images */}
        <div className="flex flex-col gap-3 ket-stagger">
          {images.map((img) => {
            const done = matched[img.en];
            const isWrong = wrongImg === img.en;
            return (
              <button
                key={img.en}
                data-testid={`match-image-${img.en.replace(/\s+/g, "-")}`}
                onClick={() => onImageActivate(img)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  tryMatch(e.dataTransfer.getData("text/plain"), img.en);
                }}
                className={`ket-btn bg-white flex items-center justify-center h-20 sm:h-24 ${
                  isWrong ? "ket-shake" : ""
                } ${done ? "ket-pop" : ""}`}
                style={{
                  borderColor: done ? "#15803D" : topic.theme.border,
                  backgroundColor: done ? "#DCFCE7" : "#fff",
                }}
              >
                {done ? (
                  <CheckCircle2 className="w-9 h-9 text-green-600" />
                ) : (
                  <ItemImage item={img} kind={topic.kind} size="text-4xl sm:text-5xl" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <div className="font-fredoka font-bold text-2xl text-green-600 ket-pop">Loistavaa! 🎉</div>
      )}
    </div>
  );
}
