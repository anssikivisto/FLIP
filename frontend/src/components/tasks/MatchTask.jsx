import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { ItemImage } from "../ItemImage";
import { Mascot } from "../Chrome";
import { shuffle } from "../../lib/content";
import { speak, playCorrect, playTryAgain, playStar } from "../../lib/audio";
import { CheckCircle2 } from "lucide-react";

const BATCH = 4;
const DRAG_THRESHOLD = 6; // px before a press becomes a drag

function buildBatches(pool) {
  const picked = shuffle(pool);
  const batches = [];
  for (let i = 0; i < picked.length; i += BATCH) {
    batches.push(picked.slice(i, i + BATCH));
  }
  // Avoid a lonely trailing batch of 1 — merge it into the previous batch.
  if (batches.length > 1 && batches[batches.length - 1].length < 2) {
    const tail = batches.pop();
    batches[batches.length - 1] = batches[batches.length - 1].concat(tail);
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
  const [drag, setDrag] = useState(null); // { word, x, y, moved }
  const [hoverImg, setHoverImg] = useState(null);
  const [showHint, setShowHint] = useState(
    () => localStorage.getItem("ket_match_hint_seen") !== "1"
  );
  const startRef = useRef({ x: 0, y: 0 });
  const matchedRef = useRef({});

  const dismissHint = () => {
    setShowHint(false);
    localStorage.setItem("ket_match_hint_seen", "1");
  };

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
      matchedRef.current = {};
    }
  };

  const tryMatch = (wordEn, imgEn) => {
    if (matchedRef.current[imgEn]) return;
    if (wordEn === imgEn) {
      const m = { ...matchedRef.current, [imgEn]: true };
      matchedRef.current = m;
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

  const dropTargetAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const drop = el && el.closest("[data-drop-en]");
    return drop ? drop.getAttribute("data-drop-en") : null;
  };

  const onPointerDown = (e, w) => {
    if (matched[w.en]) return;
    if (showHint) dismissHint();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
    startRef.current = { x: e.clientX, y: e.clientY };
    setDrag({ word: w, x: e.clientX, y: e.clientY, moved: false });
  };

  const onPointerMove = (e) => {
    if (!drag) return;
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    const moved = drag.moved || Math.hypot(dx, dy) > DRAG_THRESHOLD;
    setDrag({ ...drag, x: e.clientX, y: e.clientY, moved });
    if (moved) setHoverImg(dropTargetAt(e.clientX, e.clientY));
  };

  const onPointerUp = (e, w) => {
    const d = drag;
    setDrag(null);
    setHoverImg(null);
    if (!d) return;
    if (d.moved) {
      const imgEn = dropTargetAt(e.clientX, e.clientY);
      if (imgEn) tryMatch(w.en, imgEn);
    } else {
      // treat as tap select/deselect
      setSelectedWord((prev) => (prev === w.en ? null : w.en));
    }
  };

  const onImageTap = (img) => {
    if (matched[img.en]) return;
    if (selectedWord) tryMatch(selectedWord, img.en);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full ket-fade-in select-none">
      <Mascot message="Raahaa sana oikean kuvan päälle — tai napauta sana ja sitten kuva!" small />
      <p className="font-fredoka text-slate-400 font-semibold">
        Osa {bi + 1} / {batches.length}
      </p>

      <div className="relative grid grid-cols-2 gap-5 sm:gap-8 w-full max-w-3xl mx-auto">
        {showHint && (
          <div
            data-testid="match-drag-hint"
            className="pointer-events-none absolute inset-x-0 -top-3 flex justify-center z-30"
          >
            <div className="flex items-center gap-2 bg-white/95 border-4 border-amber-300 rounded-full px-4 py-2 shadow-lg ket-pop">
              <span className="text-3xl ket-drag-hint">👉</span>
              <span className="font-fredoka font-bold text-slate-600">Raahaa sana kuvaan!</span>
            </div>
          </div>
        )}
        {/* Words */}
        <div className="flex flex-col gap-3 ket-stagger">
          {words.map((w) => {
            const done = matched[w.en];
            const active = selectedWord === w.en;
            const isDragging = drag && drag.moved && drag.word.en === w.en;
            return (
              <button
                key={w.en}
                data-testid={`match-word-${w.en.replace(/\s+/g, "-")}`}
                onPointerDown={(e) => onPointerDown(e, w)}
                onPointerMove={onPointerMove}
                onPointerUp={(e) => onPointerUp(e, w)}
                disabled={done}
                className="ket-btn px-4 py-4 font-fredoka font-bold text-xl sm:text-2xl text-center touch-none"
                style={{
                  backgroundColor: active ? topic.theme.accent : "#fff",
                  color: active ? "#fff" : "#1E293B",
                  borderColor: topic.theme.border,
                  visibility: done || isDragging ? "hidden" : "visible",
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
            const isHover = hoverImg === img.en && !done;
            return (
              <div
                key={img.en}
                data-drop-en={img.en}
                data-testid={`match-image-${img.en.replace(/\s+/g, "-")}`}
                onClick={() => onImageTap(img)}
                className={`ket-btn bg-white flex items-center justify-center h-20 sm:h-24 cursor-pointer ${
                  isWrong ? "ket-shake" : ""
                } ${done ? "ket-pop" : ""}`}
                style={{
                  borderColor: done ? "#15803D" : isHover ? topic.theme.accent : topic.theme.border,
                  backgroundColor: done ? "#DCFCE7" : isHover ? topic.theme.bg : "#fff",
                  transform: isHover ? "scale(1.05)" : "none",
                }}
              >
                {done ? (
                  <CheckCircle2 className="w-9 h-9 text-green-600" />
                ) : (
                  <ItemImage item={img} kind={topic.kind} size="text-4xl sm:text-5xl" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating dragged tile — centered on the pointer (portal to body so
          position:fixed is relative to the viewport, not a transformed ancestor) */}
      {drag &&
        drag.moved &&
        createPortal(
          <div
            className="fixed font-fredoka font-bold text-xl sm:text-2xl px-5 py-4 rounded-2xl border-4 shadow-2xl text-white"
            style={{
              left: drag.x,
              top: drag.y,
              transform: "translate(-50%, -50%) rotate(-3deg) scale(1.06)",
              backgroundColor: topic.theme.accent,
              borderColor: topic.theme.border,
              pointerEvents: "none",
              zIndex: 9999,
            }}
          >
            {drag.word.en}
          </div>,
          document.body
        )}

      {allMatched && (
        <div className="font-fredoka font-bold text-2xl text-green-600 ket-pop">Loistavaa! 🎉</div>
      )}
    </div>
  );
}
