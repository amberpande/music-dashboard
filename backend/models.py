from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DBStats(BaseModel):
    songs: int
    artists: int
    song_artist_relations: int
    primary_artists: int
    featured_artists: int
    song_aliases: int
    artist_aliases: int

class SecondaryStats(BaseModel):
    songs_with_secondary: int
    unique_secondary_count: int
    total_secondary_mentions: int
    existing_in_artist_table: int
    missing_from_artist_table: int
    missing_relationships: int

class DeduplicationStats(BaseModel):
    song_aliases: int
    artist_aliases: int
    songs_without_aliases: int
    canonical_mappings: int
    artists_without_aliases: int

class DatabaseIssues(BaseModel):
    orphaned_songs: int
    missing_primary: int
    inconsistent_artists: int
    duplicate_relations: int
    orphaned_aliases: int
    null_values: Optional[int] = 0

class RecentSong(BaseModel):
    id: int
    song: str
    artist_0: str
    created_at: Optional[datetime]
    artist_count: int

class TopArtist(BaseModel):
    id: int
    name: str
    song_count: int
    primary_count: int
    featured_count: int

class DistributionData(BaseModel):
    artistsPerSong: List[dict]
    songsPerArtist: List[dict]

class YearDistribution(BaseModel):
    year: int
    count: int

class TopGenre(BaseModel):
    name: str
    count: int

class HealthScore(BaseModel):
    overall_health: float
    completeness_score: float
    data_quality_score: float
    relationship_score: float
    total_songs: int
    total_artists: int
    primary_relationships: int
    null_values: int
    orphaned_songs: int