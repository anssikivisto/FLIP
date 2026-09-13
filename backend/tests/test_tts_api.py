"""Backend tests for TTS endpoint /api/tts/{slug} — cached MP3s from Object Storage."""
import os
import requests
import pytest

BASE_URL = (os.environ.get("REACT_APP_BACKEND_URL") or
            open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()).rstrip("/")


@pytest.fixture(scope="module")
def client():
    return requests.Session()


# Known slugs across topics
KNOWN_SLUGS = [
    "dog", "ice-cream", "one-hundred", "twenty-one", "high-heels", "red", "seven",
    "giraffe", "pizza", "watermelon", "purple", "tongue", "sunglasses", "volcano",
    "eleven", "ninety",
]


@pytest.mark.parametrize("slug", KNOWN_SLUGS)
def test_known_slug_returns_mp3(client, slug):
    r = client.get(f"{BASE_URL}/api/tts/{slug}")
    assert r.status_code == 200, f"{slug} -> {r.status_code}"
    assert r.headers.get("content-type", "").startswith("audio/mpeg"), r.headers
    assert len(r.content) > 100, f"empty body for {slug}"
    assert "cache-control" in {k.lower() for k in r.headers.keys()}


def test_unknown_slug_returns_404(client):
    r = client.get(f"{BASE_URL}/api/tts/notaword")
    assert r.status_code == 404
