import React, { useState, useRef, useEffect } from "react";
import { ItemImage } from "../ItemImage";
import { Mascot, NextArrow } from "../Chrome";
import { shuffle } from "../../lib/content";
import { speak } from "../../lib/audio";
import { Mic, Square, Play, Volume2 } from "lucide-react";

const ROUND = 10;

// Speak task: show image, record own voice, play it back. No scoring/judgment.
export function SpeakTask({ topic, pool, onStar, onFinish }) {
  const [words] = useState(() => shuffle(pool).slice(0, Math.min(ROUND, pool.length)));
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [micError, setMicError] = useState(false);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const starredRef = useRef({});

  const item = words[idx];

  useEffect(() => {
    const t = setTimeout(() => speak(item.en), 400);
    return () => clearTimeout(t);
  }, [idx, item.en]);

  useEffect(() => () => { if (audioUrl) URL.revokeObjectURL(audioUrl); }, [audioUrl]);

  const startRecording = async () => {
    setMicError(false);
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRef.current = mr;
      mr.start();
      setRecording(true);
    } catch (e) {
      setMicError(true);
    }
  };

  const stopRecording = () => {
    if (mediaRef.current && recording) {
      mediaRef.current.stop();
      setRecording(false);
      if (!starredRef.current[item.en]) { starredRef.current[item.en] = true; onStar(); }
    }
  };

  const playBack = () => {
    if (audioUrl) new Audio(audioUrl).play();
  };

  const next = () => {
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }
    setRecording(false);
    if (idx + 1 >= words.length) onFinish();
    else setIdx(idx + 1);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full ket-fade-in">
      <Mascot message="Katso kuvaa, sano sana ja kuuntele oma äänesi!" small />
      <p className="font-fredoka text-slate-400 font-semibold">{idx + 1} / {words.length}</p>

      <div
        className="bg-white rounded-3xl border-4 shadow-lg flex flex-col items-center justify-center gap-3 p-8 w-full max-w-sm ket-pop"
        style={{ borderColor: topic.theme.border }}
      >
        <ItemImage item={item} kind={topic.kind} />
        <button
          data-testid="audio-listen-button"
          onClick={() => speak(item.en)}
          className="flex items-center gap-2 font-fredoka font-bold text-2xl sm:text-3xl mt-2"
          style={{ color: topic.theme.accent }}
        >
          <Volume2 className="w-7 h-7" /> {item.en}
        </button>
        <span className="text-slate-400 font-semibold text-lg">{item.fi}</span>
      </div>

      {micError && (
        <p className="text-amber-600 font-bold text-center max-w-sm">
          Mikrofonia ei löytynyt — ei haittaa! Voit silti sanoa sanan ääneen ja jatkaa. 😊
        </p>
      )}

      <div className="flex items-center gap-4 flex-wrap justify-center">
        {!recording ? (
          <button
            data-testid="record-button"
            onClick={startRecording}
            className="ket-btn flex items-center gap-2 px-7 py-4 font-fredoka font-bold text-xl text-white"
            style={{ backgroundColor: "#FB7185", borderColor: "#BE123C" }}
          >
            <Mic className="w-7 h-7" /> Nauhoita
          </button>
        ) : (
          <button
            data-testid="stop-record-button"
            onClick={stopRecording}
            className="ket-btn flex items-center gap-2 px-7 py-4 font-fredoka font-bold text-xl text-white ket-wiggle"
            style={{ backgroundColor: "#DC2626", borderColor: "#7F1D1D" }}
          >
            <Square className="w-6 h-6 fill-white" /> Lopeta
          </button>
        )}

        {audioUrl && (
          <button
            data-testid="play-recording-button"
            onClick={playBack}
            className="ket-btn flex items-center gap-2 px-7 py-4 font-fredoka font-bold text-xl text-white ket-pop"
            style={{ backgroundColor: "#4ADE80", borderColor: "#15803D" }}
          >
            <Play className="w-6 h-6 fill-white" /> Kuuntele
          </button>
        )}
      </div>

      <NextArrow onClick={next} label={idx + 1 >= words.length ? "Valmis" : "Seuraava"} />
    </div>
  );
}
