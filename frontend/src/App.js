import React, { useEffect, useState, useCallback } from "react";
import { loadContent, getPool } from "./lib/content";
import { getProgress, addStars, completeRound, resetProgress } from "./lib/storage";
import { isMuted, setMuted } from "./lib/audio";
import { Header } from "./components/Chrome";
import { TopicMenu, NumberLevelSelect, TaskMenu, RoundComplete } from "./components/Screens";
import { RecognizeTask } from "./components/tasks/RecognizeTask";
import { MatchTask } from "./components/tasks/MatchTask";
import { SpeakTask } from "./components/tasks/SpeakTask";
import { WriteTask } from "./components/tasks/WriteTask";
import { Loader2 } from "lucide-react";

const TASK_LABEL = { recognize: "Tunnista", match: "Yhdistä", speak: "Puhu", write: "Kirjoita sana" };

export default function App() {
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState(false);

  const [screen, setScreen] = useState("menu"); // menu | levels | tasks | game | complete
  const [topic, setTopic] = useState(null);
  const [level, setLevel] = useState(null);
  const [task, setTask] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  const [progress, setProgress] = useState(getProgress());
  const [muted, setMutedState] = useState(isMuted());
  const [roundStars, setRoundStars] = useState(0);

  useEffect(() => {
    loadContent().then(setTopics).catch(() => setError(true));
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const onStar = useCallback(() => {
    setProgress(addStars(1));
    setRoundStars((s) => s + 1);
  }, []);

  const pickTopic = (t) => {
    setTopic(t);
    setLevel(t.has_levels ? null : null);
    setScreen(t.has_levels ? "levels" : "tasks");
  };

  const pickLevel = (lvlId) => {
    setLevel(lvlId);
    setScreen("tasks");
  };

  const pickTask = (taskId) => {
    setTask(taskId);
    setRoundStars(0);
    setGameKey((k) => k + 1);
    setScreen("game");
  };

  const onFinish = () => {
    setProgress(completeRound(topic.id, task));
    setScreen("complete");
  };

  const playAgain = () => {
    setRoundStars(0);
    setGameKey((k) => k + 1);
    setScreen("game");
  };

  const handleBack = () => {
    if (screen === "game" || screen === "complete") setScreen("tasks");
    else if (screen === "tasks") setScreen(topic && topic.has_levels ? "levels" : "menu");
    else if (screen === "levels") setScreen("menu");
  };

  const doReset = () => {
    setProgress(resetProgress());
  };

  const canBack = screen !== "menu";

  const headerTitle =
    screen === "menu"
      ? "Kid English Trainer"
      : screen === "game" || screen === "complete"
      ? `${topic.title_fi} · ${TASK_LABEL[task]}`
      : topic
      ? topic.title_fi
      : "";

  const accent = topic ? topic.theme.accent : "#0369A1";

  if (error) {
    return (
      <div className="ket-canvas flex items-center justify-center p-8 text-center">
        <div className="bg-white rounded-3xl border-4 border-amber-300 p-8 max-w-md">
          <div className="text-5xl mb-3">🦉</div>
          <p className="font-fredoka font-bold text-xl text-slate-600">
            Hups! Sisältöä ei saatu ladattua. Tarkista nettiyhteys ja päivitä sivu.
          </p>
        </div>
      </div>
    );
  }

  if (!topics) {
    return (
      <div className="ket-canvas flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-sky-400" />
        <p className="font-fredoka font-bold text-slate-400 text-lg">Ladataan…</p>
      </div>
    );
  }

  const pool = topic ? getPool(topic, level) : [];

  return (
    <div className="ket-canvas flex flex-col">
      <Header
        title={headerTitle}
        accent={accent}
        onBack={handleBack}
        canBack={canBack}
        stars={progress.stars}
        muted={muted}
        onToggleMute={toggleMute}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
        {screen === "menu" && (
          <TopicMenu topics={topics} progress={progress} onPick={pickTopic} onReset={doReset} />
        )}
        {screen === "levels" && topic && <NumberLevelSelect topic={topic} onPick={pickLevel} />}
        {screen === "tasks" && topic && <TaskMenu topic={topic} onPick={pickTask} />}

        {screen === "game" && task === "recognize" && (
          <RecognizeTask key={gameKey} topic={topic} pool={pool} onStar={onStar} onFinish={onFinish} />
        )}
        {screen === "game" && task === "match" && (
          <MatchTask key={gameKey} topic={topic} pool={pool} onStar={onStar} onFinish={onFinish} />
        )}
        {screen === "game" && task === "speak" && (
          <SpeakTask key={gameKey} topic={topic} pool={pool} onStar={onStar} onFinish={onFinish} />
        )}
        {screen === "game" && task === "write" && (
          <WriteTask key={gameKey} topic={topic} pool={pool} onStar={onStar} onFinish={onFinish} />
        )}

        {screen === "complete" && topic && (
          <RoundComplete topic={topic} earned={roundStars} onAgain={playAgain} onMenu={() => setScreen("tasks")} />
        )}
      </main>
    </div>
  );
}
