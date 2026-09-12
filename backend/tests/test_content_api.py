"""Backend tests for Kid English Trainer content API."""
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


def test_content_returns_four_topics(client):
    r = client.get(f"{BASE_URL}/api/content")
    assert r.status_code == 200
    data = r.json()
    assert "topics" in data
    topics = data["topics"]
    assert len(topics) == 4
    ids = [t["id"] for t in topics]
    assert ids == ["animals", "colors", "numbers", "foods"]


def test_content_item_counts(client):
    r = client.get(f"{BASE_URL}/api/content")
    topics = {t["id"]: t for t in r.json()["topics"]}
    assert len(topics["animals"]["items"]) == 25
    assert len(topics["foods"]["items"]) == 25
    assert len(topics["colors"]["items"]) == 10
    levels = topics["numbers"]["levels"]
    assert len(levels) == 3
    lvl_map = {l["id"]: l for l in levels}
    assert len(lvl_map["1-10"]["items"]) == 10
    assert len(lvl_map["11-20"]["items"]) == 10
    assert len(lvl_map["21-100"]["items"]) == 80
    assert topics["numbers"]["has_levels"] is True


def test_content_no_mongo_id(client):
    r = client.get(f"{BASE_URL}/api/content")
    for t in r.json()["topics"]:
        assert "_id" not in t


def test_topics_lightweight(client):
    r = client.get(f"{BASE_URL}/api/topics")
    assert r.status_code == 200
    topics = r.json()["topics"]
    assert len(topics) == 4
    for t in topics:
        assert "items" not in t
        assert "levels" not in t
        assert "id" in t and "title_fi" in t and "title_en" in t


def test_topic_by_id_valid(client):
    r = client.get(f"{BASE_URL}/api/topics/animals")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "animals"
    assert len(data["items"]) == 25


def test_topic_by_id_numbers_has_levels(client):
    r = client.get(f"{BASE_URL}/api/topics/numbers")
    assert r.status_code == 200
    data = r.json()
    assert data["has_levels"] is True
    assert len(data["levels"]) == 3


def test_topic_by_id_404(client):
    r = client.get(f"{BASE_URL}/api/topics/nonexistent")
    assert r.status_code == 404


def test_number_translations_sample(client):
    r = client.get(f"{BASE_URL}/api/topics/numbers")
    levels = {l["id"]: l for l in r.json()["levels"]}
    # spot check
    items_1_10 = {i["value"]: i for i in levels["1-10"]["items"]}
    assert items_1_10[1]["en"] == "one"
    assert items_1_10[10]["en"] == "ten"
    items_21_100 = {i["value"]: i for i in levels["21-100"]["items"]}
    assert items_21_100[21]["en"] == "twenty-one"
    assert items_21_100[100]["en"] == "one hundred"
