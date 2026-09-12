import React from "react";
import { STAR_STICKERS, MASTERY_STICKERS, MASTERY_TIMES } from "../lib/stickers";
import { Lock } from "lucide-react";

function StickerCell({ sticker, unlocked, hint }) {
  return (
    <div
      data-testid={`sticker-${sticker.id}`}
      className={`relative flex flex-col items-center justify-center gap-1 p-3 rounded-2xl border-4 aspect-square transition-transform ${
        unlocked ? "bg-white ket-pop hover:-translate-y-1" : "bg-slate-50"
      }`}
      style={{ borderColor: unlocked ? "#FBBF24" : "#E2E8F0" }}
    >
      <span
        className="text-4xl sm:text-5xl leading-none"
        style={{ filter: unlocked ? "none" : "grayscale(1)", opacity: unlocked ? 1 : 0.35 }}
      >
        {sticker.emoji}
      </span>
      <span
        className={`font-fredoka font-bold text-xs sm:text-sm text-center leading-tight ${
          unlocked ? "text-slate-700" : "text-slate-400"
        }`}
      >
        {sticker.name_fi}
      </span>
      {!unlocked && (
        <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
          <Lock className="w-3 h-3" /> {hint}
        </span>
      )}
    </div>
  );
}

export function StickerAlbum({ progress }) {
  const unlocked = progress.unlocked || [];
  const completed = progress.completed || {};
  const roundCount = (topicId) =>
    Object.entries(completed).filter(([k]) => k.startsWith(`${topicId}:`)).reduce((s, [, v]) => s + v, 0);

  const total = STAR_STICKERS.length + MASTERY_STICKERS.length;

  return (
    <div className="flex flex-col items-center gap-6 w-full ket-fade-in" data-testid="sticker-album">
      <div className="text-center">
        <h2 className="font-fredoka font-bold text-3xl sm:text-4xl text-amber-500">Tarrat 🏅</h2>
        <p className="text-slate-500 font-bold text-lg mt-1">
          Kerätty {unlocked.length} / {total} · sinulla on {progress.stars} tähteä ⭐
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <h3 className="font-fredoka font-bold text-xl text-slate-500 mb-3">Ansaitse tähdillä ⭐</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
          {STAR_STICKERS.map((s) => (
            <StickerCell
              key={s.id}
              sticker={s}
              unlocked={unlocked.includes(s.id)}
              hint={`${s.cost} ⭐`}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <h3 className="font-fredoka font-bold text-xl text-slate-500 mb-3">Aihemestarit 🎯</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
          {MASTERY_STICKERS.map((m) => (
            <StickerCell
              key={m.id}
              sticker={m}
              unlocked={unlocked.includes(m.id)}
              hint={`${roundCount(m.topic)}/${MASTERY_TIMES} ${m.topic_fi}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function StickerUnlockPopup({ sticker, onClose }) {
  if (!sticker) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-6 cursor-pointer"
      data-testid="sticker-unlock-popup"
    >
      <div className="ket-pop bg-white rounded-3xl border-4 border-amber-400 shadow-2xl px-8 py-8 flex flex-col items-center gap-3 max-w-xs text-center">
        <span className="font-fredoka font-bold text-lg text-amber-500 uppercase tracking-wider">
          Uusi tarra!
        </span>
        <span className="text-8xl ket-bounce-slow leading-none">{sticker.emoji}</span>
        <span className="font-fredoka font-bold text-3xl text-slate-700">{sticker.name_fi}</span>
        <button
          data-testid="sticker-unlock-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="ket-btn mt-2 px-8 py-3 font-fredoka font-bold text-xl text-white"
          style={{ backgroundColor: "#4ADE80", borderColor: "#15803D" }}
        >
          Jee! 🎉
        </button>
      </div>
    </div>
  );
}
