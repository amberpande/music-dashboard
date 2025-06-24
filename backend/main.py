from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from .crud import (
    get_db_stats, get_secondary_stats, get_deduplication_stats, get_database_issues,
    get_recent_songs, get_top_artists, get_distribution_data, get_year_distribution,
    get_top_genres, get_health_score,
    search_songs_backend, search_artists_backend,
    get_song_variants, get_artist_variants
)
from .models import (
    DBStats, SecondaryStats, DeduplicationStats, DatabaseIssues, RecentSong, TopArtist,
    DistributionData, YearDistribution, TopGenre, HealthScore
)
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stats", response_model=DBStats)
def stats():
    return get_db_stats()

@app.get("/secondary-stats", response_model=SecondaryStats)
def secondary_stats():
    return get_secondary_stats()

@app.get("/deduplication-stats", response_model=DeduplicationStats)
def deduplication_stats():
    return get_deduplication_stats()

@app.get("/issues", response_model=DatabaseIssues)
def issues():
    return get_database_issues()

@app.get("/recent-songs", response_model=List[RecentSong])
def recent_songs():
    return get_recent_songs()

@app.get("/top-artists", response_model=List[TopArtist])
def top_artists():
    return get_top_artists()

@app.get("/distribution", response_model=DistributionData)
def distribution():
    return get_distribution_data()

@app.get("/year-distribution", response_model=List[YearDistribution])
def year_distribution():
    return get_year_distribution()

@app.get("/top-genres", response_model=List[TopGenre])
def top_genres():
    return get_top_genres()

@app.get("/health", response_model=HealthScore)
def health():
    return get_health_score()

@app.get("/search/songs")
def search_songs(q: str = Query(..., min_length=2), limit: int = 50):
    return search_songs_backend(q, limit)

@app.get("/search/artists")
def search_artists(q: str = Query(..., min_length=2), limit: int = 50):
    return search_artists_backend(q, limit)

@app.get("/variants/song/{song_id}")
def song_variants(song_id: int):
    return get_song_variants(song_id)

@app.get("/variants/artist/{artist_id}")
def artist_variants(artist_id: int):
    return get_artist_variants(artist_id)