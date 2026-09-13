# Kid English Trainer (Finnish → English) — PRD

## Original Problem Statement
Pelillistetty sanastopeli suomenkielisille 7–8-vuotiaille (Finnish → English). Web-sovellus, responsiivinen, toimii koulun tableteilla ja kotikoneilla. Ei tilejä, ei henkilötietoja, ei puheen arvostelua.

## Architecture
- **Frontend:** React (JSX) + Tailwind, single-page state machine (menu → levels → tasks → game → complete). No URL routing.
- **Backend:** FastAPI serving the content library as JSON (`/api/content`, `/api/topics`, `/api/topics/{id}`). Content editable in `/app/backend/content_data.py`.
- **DB:** MongoDB `content_topics` collection, idempotently seeded on startup.
- **Audio:** Browser `SpeechSynthesis` (English word playback) + `MediaRecorder` (Speak task) + Web Audio sound effects.
- **Progress:** browser `localStorage` (stars, streak) — no server-side personal data (GDPR-K).
- Content cached in `localStorage` for offline / flaky school wifi.

## User Personas
- Primary: 7–8-year-old Finnish early readers, touch-first.
- Secondary: parents/teachers who just open the app and hand over the device.

## Core Requirements (static)
- Topics: Eläimet (25), Värit (10), Numerot (levels 1-10 / 11-20 / 21-100), Ruoat (25).
- Task types: Tunnista, Yhdistä, Puhu, Kirjoita sana.
- Fixed top back-button; forward arrow (→); star rewards; mute toggle; Finnish instructions, English target words.
- No accounts, no personal data, no speech scoring.

## Implemented (2026-06-12)
- Backend content library + 3 read endpoints, MongoDB seeding. (tested 100%)
- Topic menu, number-level select, task menu, round-complete screen with mascot (frog Flip 🐸).
- Task components: Opettele (flashcards review, NO stars), Recognize (correct answer shown large & centered, stays until player clicks → arrow), Match (tap + drag, uses ALL topic words in batches of 4), Speak (record/playback, mic fallback, no scoring), Write (live green letters, case-insensitive, two-step hint: 1st press speaks, 2nd press also shows word, TTS on complete).
- Sticky top back-button, → NextArrow, star + streak counters, mute toggle, reset progress.
- localStorage progress + content caching. Warm playful palette, Fredoka/Nunito fonts, tactile 3D buttons, staggered animations.
- Topics (7): Eläimet 25, Värit 10, Numerot (1-10/11-20/21-100), Ruoat 25, Keho 25, Vaatteet 25, Luonto 25.
- Header title "English Trainer".
- Full e2e tested: backend 10/10 pytest, frontend all flows pass.
- Reward stickers (2026-06-12): 10 star-threshold stickers (5→300 ⭐, cumulative, never spent) + 7 topic-mastery stickers (finish a topic 3×). Album screen from menu (🏅 Tarrat) + unlock celebration popup. All localStorage, tested 100%.
- Voice settings (2026-06-12): header gear opens Ääniasetukset modal — British/American accent toggle + speech-rate slider (0.5–1.3×). Persists to localStorage 'ket_voice_v1' and applies to all SpeechSynthesis playback. Tested 100%.
- Iteration (2026-06-12): raised sticker star thresholds (15/40/75/120/175/240/320/420/550/700); removed mute button (settings gear only in header); FIXED Match drag-and-drop via Pointer Events (floating tile follows finger/cursor, centered on grab point) with tap fallback; sticker cells open an enlarged detail modal. Tested 100%.
- Iteration (2026-06-12): Match drag polish — floating tile portaled to body so it centers exactly on the cursor; source tile hides while dragging; matched word tiles disappear (drag or tap); first-time animated drag hint (👉 'Raahaa sana kuvaan!') stored via localStorage 'ket_match_hint_seen'. Tested 100%.
- AI voice (2026-06-13): replaced browser SpeechSynthesis default with pre-generated OpenAI TTS (voice 'nova', model tts-1) cached in Emergent Object Storage; backend serves GET /api/tts/{slug} (audio/mpeg, long cache) with 404->browser fallback. 234 words generated once via generate_audio.py. Accent selector removed from Settings (single AI voice); rate slider applies via HTMLAudioElement.playbackRate. Backend 27/27 + frontend tested 100%.
- AI voice stability fix (2026-06-13): back-to-back speak() calls were causing interrupted play() promises to spuriously fall back to the browser voice, plus per-call network fetch caused delay. Fixed app-wide with a blob cache (slug->Promise), a monotonic _seq guard (only the latest call may fall back / fire onEnd), and prefetchAudio() of the round's words on game start. Verified: 0 browser-voice fallbacks in Recognize-numbers & Match, all /api/tts 200. Tested 100%.

## Backlog / Future (not now)
- P2: More topics (Perhe, Keho, Sää, Vaatteet).
- P2: Content-driven session length (Match currently fixed at 8 items).
- P2: Shareable link for colleagues to get latest content pack.
- P2: Sentence-level practice once vocabulary is mastered.
