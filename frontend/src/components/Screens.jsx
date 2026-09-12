import React from "react";
import { Mascot, NextArrow } from "./Chrome";
import { Star, Flame, RotateCcw } from "lucide-react";

const TASKS = [
  { id: "recognize", fi: "Tunnista", emoji: "🎧", desc: "Kuuntele ja napauta", color: "#38BDF8", border: "#0284C7" },
  { id: "match", fi: "Yhdistä", emoji: "🧩", desc: "Yhdistä sana ja kuva", color: "#A855F7", border: "#7E22CE" },
  { id: "speak", fi: "Puhu", emoji: "🎙️", desc: "Sano ja kuuntele itseäsi", color: "#FB7185", border: "#BE123C" },
  { id: "write", fi: "Kirjoita sana", emoji: "✍️", desc: "Kirjoita kirjaimet", color: "#4ADE80", border: "#15803D" },
];

export function TopicMenu({ topics, progress, onPick, onReset }) {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="text-center ket-fade-in">
        <h2 className="font-fredoka font-bold text-3xl sm:text-5xl" style={{ color: "#0369A1" }}>
          Opitaan englantia! 🌟
        </h2>
        <p className="text-slate-500 font-bold text-lg mt-2">Valitse aihe ja aloita</p>
      </div>

      <Mascot message="Hei! Olen Flip. Valitaan aihe!" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-4xl ket-stagger">
        {topics.map((t) => (
          <button
            key={t.id}
            data-testid={`topic-${t.id}`}
            onClick={() => onPick(t)}
            className="ket-btn flex flex-col items-center justify-center gap-2 p-6 h-48"
            style={{ backgroundColor: t.theme.bg, borderColor: t.theme.border }}
          >
            <span className="text-6xl">{t.emoji}</span>
            <span className="font-fredoka font-bold text-2xl" style={{ color: t.theme.accent }}>
              {t.title_fi}
            </span>
            <span className="font-semibold text-slate-400 text-sm">{t.title_en}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border-2 border-amber-300 font-fredoka font-bold text-amber-700">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500" /> {progress.stars} tähteä
        </div>
        <div data-testid="streak-counter" className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 border-2 border-orange-300 font-fredoka font-bold text-orange-600">
          <Flame className="w-5 h-5 fill-orange-400 text-orange-500" /> {progress.streak} päivää
        </div>
        <button
          data-testid="reset-progress-button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 border-2 border-slate-300 font-fredoka font-bold text-slate-500 text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Nollaa
        </button>
      </div>
    </div>
  );
}

export function NumberLevelSelect({ topic, onPick }) {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <Mascot message="Mitkä numerot haluat harjoitella?" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-3xl ket-stagger">
        {topic.levels.map((lvl) => (
          <button
            key={lvl.id}
            data-testid={`number-level-${lvl.id}`}
            onClick={() => onPick(lvl.id)}
            className="ket-btn flex flex-col items-center justify-center gap-2 p-8 h-40"
            style={{ backgroundColor: topic.theme.bg, borderColor: topic.theme.border }}
          >
            <span className="text-5xl">🔢</span>
            <span className="font-fredoka font-bold text-3xl" style={{ color: topic.theme.accent }}>
              {lvl.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function TaskMenu({ topic, onPick }) {
  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <Mascot message={`${topic.title_fi} — valitse peli!`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-3xl ket-stagger">
        {TASKS.map((task) => (
          <button
            key={task.id}
            data-testid={`task-${task.id}`}
            onClick={() => onPick(task.id)}
            className="ket-btn flex items-center gap-4 p-6 bg-white text-left"
            style={{ borderColor: task.border }}
          >
            <span className="text-5xl shrink-0">{task.emoji}</span>
            <span className="flex flex-col">
              <span className="font-fredoka font-bold text-2xl" style={{ color: task.border }}>
                {task.fi}
              </span>
              <span className="font-semibold text-slate-400 text-base">{task.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RoundComplete({ topic, earned, onAgain, onMenu }) {
  const stars = Math.min(3, Math.max(1, Math.round(earned / 4)));
  return (
    <div className="flex flex-col items-center gap-6 w-full ket-fade-in text-center">
      <div className="text-7xl ket-bounce-slow">🎉</div>
      <h2 className="font-fredoka font-bold text-4xl" style={{ color: topic.theme.accent }}>
        Hyvin tehty!
      </h2>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <Star
            key={i}
            className={`w-14 h-14 ket-pop ${i < stars ? "fill-amber-400 text-amber-500" : "text-slate-200 fill-slate-100"}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="font-fredoka font-bold text-xl text-slate-500">
        Sait {earned} tähteä tällä kierroksella!
      </p>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <button
          data-testid="play-again-button"
          onClick={onMenu}
          className="ket-btn px-6 py-4 font-fredoka font-bold text-lg bg-white"
          style={{ borderColor: "#CBD5E1", color: "#475569" }}
        >
          Valikkoon
        </button>
        <NextArrow onClick={onAgain} label="Pelaa lisää" />
      </div>
    </div>
  );
}
