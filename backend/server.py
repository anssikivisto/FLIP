from fastapi import FastAPI, APIRouter, HTTPException, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import asyncio
import logging
from pathlib import Path

from content_data import build_topics
from audio_storage import init_storage, get_object

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Kid English Trainer API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


async def seed_content():
    """Load the content library into MongoDB (idempotent upsert)."""
    topics = build_topics()
    for topic in topics:
        await db.content_topics.update_one(
            {"id": topic["id"]}, {"$set": topic}, upsert=True
        )
    logger.info("Seeded %d content topics", len(topics))


@api_router.get("/")
async def root():
    return {"message": "Kid English Trainer API"}


@api_router.get("/content")
async def get_content():
    """Full content library (topics + word/emoji/audio lists) for offline caching."""
    topics = await db.content_topics.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    if not topics:
        await seed_content()
        topics = await db.content_topics.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return {"topics": topics}


@api_router.get("/topics")
async def get_topics():
    """Lightweight topic metadata (no item lists)."""
    topics = await db.content_topics.find(
        {}, {"_id": 0, "items": 0, "levels": 0}
    ).sort("order", 1).to_list(100)
    if not topics:
        await seed_content()
        topics = await db.content_topics.find(
            {}, {"_id": 0, "items": 0, "levels": 0}
        ).sort("order", 1).to_list(100)
    return {"topics": topics}


@api_router.get("/topics/{topic_id}")
async def get_topic(topic_id: str):
    topic = await db.content_topics.find_one({"id": topic_id}, {"_id": 0})
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@api_router.get("/tts/{slug}")
async def get_tts(slug: str):
    """Serve a cached, pre-generated MP3 for an English word (falls back to
    404 so the frontend uses the browser voice for any not-yet-generated word)."""
    doc = await db.audio_cache.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Audio not generated")
    try:
        data, _ = await asyncio.to_thread(get_object, doc["path"])
    except Exception as e:
        logger.warning("TTS object fetch failed for %s: %s", slug, e)
        raise HTTPException(status_code=404, detail="Audio unavailable")
    return Response(
        content=data,
        media_type="audio/mpeg",
        headers={"Cache-Control": "public, max-age=31536000"},
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_seed():
    await seed_content()
    try:
        await asyncio.to_thread(init_storage)
        logger.info("Object storage initialized")
    except Exception as e:
        logger.error("Storage init failed: %s", e)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
