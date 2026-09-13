"""One-time batch generation of TTS audio for the whole vocabulary.
Generates one MP3 per unique English word (voice 'nova', model tts-1),
uploads to Emergent Object Storage, records slug->path in MongoDB.
Idempotent & resumable: skips words already in the audio_cache collection.

Run: python /app/backend/generate_audio.py
"""
import os
import asyncio
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

from pymongo import MongoClient
from emergentintegrations.llm.openai import OpenAITextToSpeech

from content_data import build_topics
from audio_storage import put_object, slugify, audio_path, init_storage

VOICE = "nova"
MODEL = "tts-1"


def collect_words():
    words = {}
    for topic in build_topics():
        for item in topic.get("items", []):
            words[item["en"]] = True
        for level in topic.get("levels", []):
            for item in level.get("items", []):
                words[item["en"]] = True
    return sorted(words.keys())


async def main():
    db = MongoClient(os.environ["MONGO_URL"])[os.environ["DB_NAME"]]
    cache = db.audio_cache
    cache.create_index("slug", unique=True)

    init_storage()
    tts = OpenAITextToSpeech(api_key=os.environ.get("EMERGENT_LLM_KEY"))

    words = collect_words()
    print(f"Total unique words: {len(words)}")
    done = skipped = failed = 0

    for i, word in enumerate(words, 1):
        slug = slugify(word)
        if cache.find_one({"slug": slug}):
            skipped += 1
            continue
        try:
            audio = await tts.generate_speech(text=word, model=MODEL, voice=VOICE, response_format="mp3")
            path = audio_path(slug, VOICE)
            result = put_object(path, audio, "audio/mpeg")
            cache.update_one(
                {"slug": slug},
                {"$set": {"slug": slug, "text": word, "voice": VOICE, "model": MODEL,
                          "path": result.get("path", path), "size": result.get("size")}},
                upsert=True,
            )
            done += 1
            print(f"[{i}/{len(words)}] OK  {word} -> {slug} ({result.get('size')}b)")
        except Exception as e:
            failed += 1
            print(f"[{i}/{len(words)}] FAIL {word}: {e}")

    print(f"DONE. generated={done} skipped={skipped} failed={failed}")


if __name__ == "__main__":
    asyncio.run(main())
