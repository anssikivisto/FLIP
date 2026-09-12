"""Backend tests for Kid English Trainer content API (7 topics)."""
import os
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
BASE_URL = BASE_URL.rstrip("/")


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def test_root(client):
    r = client.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert "message" in r.json()


def test_content_returns_seven_topics(client):
    r = client.get(f"{BASE_URL}/api/content")
    assert r.status_code == 200
    topics = r.json()["topics"]
    assert len(topics) == 7
    ids = [t["id"] for t in topics]
    assert ids == ["animals", "colors", "numbers", "foods", "body", "clothes", "nature"]


def test_content_item_counts(client):
    r = client.get(f"{BASE_URL}/api/content")
    topics = {t["id"]: t for t in r.json()["topics"]}
    assert len(topics["animals"]["items"]) == 25
    assert len(topics["foods"]["items"]) == 25
    assert len(topics["colors"]["items"]) == 10
    assert len(topics["body"]["items"]) == 25
    assert len(topics["clothes"]["items"]) == 25
    assert len(topics["nature"]["items"]) == 25
    levels = topics["numbers"]["levels"]
    lvl_map = {l["id"]: l for l in levels}
    assert len(lvl_map["1-10"]["items"]) == 10
    assert len(lvl_map["11-20"]["items"]) == 10
    assert len(lvl_map["21-100"]["items"]) == 80


def test_new_topics_item_shape(client):
    r = client.get(f"{BASE_URL}/api/content")
    topics = {t["id"]: t for t in r.json()["topics"]}
    for tid in ("body", "clothes", "nature"):
        for it in topics[tid]["items"]:
            assert "en" in it and it["en"]
            assert "fi" in it and it["fi"]
            assert "emoji" in it and it["emoji"]


def test_content_no_mongo_id(client):
    r = client.get(f"{BASE_URL}/api/content")
    for t in r.json()["topics"]:
        assert "_id" not in t


def test_topics_lightweight(client):
    r = client.get(f"{BASE_URL}/api/topics")
    assert r.status_code == 200
    topics = r.json()["topics"]
    assert len(topics) == 7
    for t in topics:
        assert "items" not in t
        assert "levels" not in t


def test_topic_by_id_body(client):
    r = client.get(f"{BASE_URL}/api/topics/body")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "body"
    assert len(data["items"]) == 25


def test_topic_by_id_clothes(client):
    r = client.get(f"{BASE_URL}/api/topics/clothes")
    assert r.status_code == 200
    assert len(r.json()["items"]) == 25


def test_topic_by_id_nature(client):
    r = client.get(f"{BASE_URL}/api/topics/nature")
    assert r.status_code == 200
    assert len(r.json()["items"]) == 25


def test_topic_by_id_404(client):
    r = client.get(f"{BASE_URL}/api/topics/nonexistent")
    assert r.status_code == 404
