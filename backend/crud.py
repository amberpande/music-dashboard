from .db import get_db_connection
from psycopg2.extras import RealDictCursor

def get_db_stats():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT
                    (SELECT COUNT(*) FROM song_metadata) AS songs,
                    (SELECT COUNT(*) FROM artist) AS artists,
                    (SELECT COUNT(*) FROM song_artist) AS song_artist_relations,
                    (SELECT COUNT(*) FROM song_artist WHERE is_primary = TRUE) AS primary_artists,
                    (SELECT COUNT(*) FROM song_artist WHERE is_primary = FALSE) AS featured_artists,
                    (SELECT COUNT(*) FROM song_alias) AS song_aliases,
                    (SELECT COUNT(*) FROM artist_alias) AS artist_aliases
            """)
            return cursor.fetchone()

def get_secondary_stats():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT
                    COUNT(DISTINCT sm.id) AS songs_with_secondary,
                    COUNT(DISTINCT TRIM(secondary_artist)) AS unique_secondary_count,
                    COUNT(*) AS total_secondary_mentions,
                    SUM(CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END) AS existing_in_artist_table,
                    SUM(CASE WHEN a.id IS NULL THEN 1 ELSE 0 END) AS missing_from_artist_table,
                    SUM(CASE WHEN sa.song_id IS NULL THEN 1 ELSE 0 END) AS missing_relationships
                FROM song_metadata sm
                LEFT JOIN LATERAL unnest(string_to_array(sm.artist_n, ',')) AS secondary_artist ON TRUE
                LEFT JOIN artist a ON LOWER(TRIM(a.name)) = LOWER(TRIM(secondary_artist))
                LEFT JOIN song_artist sa ON sm.id = sa.song_id AND sa.artist_id = a.id AND sa.artist_order > 0
                WHERE sm.artist_n IS NOT NULL AND TRIM(sm.artist_n) != ''
            """)
            return cursor.fetchone()

def get_deduplication_stats():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT
                    (SELECT COUNT(*) FROM song_alias) AS song_aliases,
                    (SELECT COUNT(*) FROM artist_alias) AS artist_aliases,
                    (SELECT COUNT(*) FROM song_metadata WHERE id NOT IN (SELECT song_id FROM song_alias)) AS songs_without_aliases,
                    (SELECT COUNT(DISTINCT canonical_song_id) FROM song_metadata WHERE canonical_song_id IS NOT NULL) AS canonical_mappings,
                    (SELECT COUNT(*) FROM artist WHERE id NOT IN (SELECT artist_id FROM artist_alias)) AS artists_without_aliases
            """)
            return cursor.fetchone()

def get_database_issues():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Orphaned songs
            cursor.execute("""
                SELECT COUNT(*) AS orphaned_songs
                FROM song_metadata sm
                WHERE NOT EXISTS (
                    SELECT 1 FROM song_artist sa WHERE sa.song_id = sm.id
                )
            """)
            orphaned_songs = cursor.fetchone()["orphaned_songs"]

            # Missing primary
            cursor.execute("""
                SELECT COUNT(*) AS missing_primary
                FROM song_metadata sm
                LEFT JOIN (
                    SELECT song_id FROM song_artist WHERE is_primary = TRUE GROUP BY song_id
                ) primary_rel ON sm.id = primary_rel.song_id
                WHERE primary_rel.song_id IS NULL
            """)
            missing_primary = cursor.fetchone()["missing_primary"]

            # Inconsistent artists
            cursor.execute("""
                SELECT COUNT(*) AS inconsistent_artists
                FROM song_metadata sm
                JOIN song_artist sa ON sm.id = sa.song_id AND sa.artist_order = 0
                JOIN artist a ON sa.artist_id = a.id
                WHERE sm.artist_0 IS NOT NULL 
                AND TRIM(sm.artist_0) != ''
                AND LOWER(TRIM(sm.artist_0)) != LOWER(TRIM(a.name))
                AND NOT EXISTS (
                    SELECT 1 FROM artist_alias aa 
                    WHERE aa.artist_id = a.id 
                    AND LOWER(TRIM(aa.alias)) = LOWER(TRIM(sm.artist_0))
                )
            """)
            inconsistent_artists = cursor.fetchone()["inconsistent_artists"]

            # Duplicate relations
            cursor.execute("""
                SELECT COUNT(*) AS duplicate_relations FROM (
                    SELECT song_id, artist_id, COUNT(*) as count
                    FROM song_artist
                    GROUP BY song_id, artist_id
                    HAVING COUNT(*) > 1
                ) as duplicates
            """)
            duplicate_relations = cursor.fetchone()["duplicate_relations"]

            # Orphaned aliases
            cursor.execute("""
                SELECT COUNT(*) AS orphaned_aliases FROM song_alias sa
                LEFT JOIN song_metadata sm ON sa.song_id = sm.id
                WHERE sm.id IS NULL
            """)
            orphaned_aliases = cursor.fetchone()["orphaned_aliases"]

            # Null values
            cursor.execute("""
                SELECT COUNT(*) AS null_values FROM song_metadata WHERE song IS NULL OR artist_0 IS NULL
            """)
            null_values = cursor.fetchone()["null_values"]

            return {
                "orphaned_songs": orphaned_songs,
                "missing_primary": missing_primary,
                "inconsistent_artists": inconsistent_artists,
                "duplicate_relations": duplicate_relations,
                "orphaned_aliases": orphaned_aliases,
                "null_values": null_values
            }

def get_recent_songs():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    sm.id, 
                    sm.song, 
                    sm.artist_0,
                    sm.created_at,
                    COUNT(sa.song_id) as artist_count
                FROM song_metadata sm
                LEFT JOIN song_artist sa ON sm.id = sa.song_id
                GROUP BY sm.id, sm.song, sm.artist_0, sm.created_at
                ORDER BY sm.created_at DESC
                LIMIT 10
            """)
            return cursor.fetchall()

def get_top_artists():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT 
                    a.id, 
                    a.name, 
                    COUNT(sa.song_id) as song_count,
                    SUM(CASE WHEN sa.is_primary THEN 1 ELSE 0 END) as primary_count,
                    SUM(CASE WHEN NOT sa.is_primary THEN 1 ELSE 0 END) as featured_count
                FROM artist a
                JOIN song_artist sa ON a.id = sa.artist_id
                GROUP BY a.id, a.name
                ORDER BY song_count DESC
                LIMIT 10
            """)
            return cursor.fetchall()

def get_distribution_data():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Artists per song: binning
            cursor.execute("""
                SELECT COUNT(sa.artist_id) as artist_count
                FROM song_artist sa
                GROUP BY sa.song_id
            """)
            artist_counts = [row['artist_count'] for row in cursor.fetchall()]
            bins_artists = {
                '1 artist': 0,
                '2 artists': 0,
                '3 artists': 0,
                '4+ artists': 0
            }
            for count in artist_counts:
                if count == 1:
                    bins_artists['1 artist'] += 1
                elif count == 2:
                    bins_artists['2 artists'] += 1
                elif count == 3:
                    bins_artists['3 artists'] += 1
                else:
                    bins_artists['4+ artists'] += 1
            artistsPerSong = [
                { 'name': k, 'value': v } for k, v in bins_artists.items() if v > 0
            ]

            # Songs per artist: binning
            cursor.execute("""
                SELECT COUNT(sa.song_id) as song_count
                FROM song_artist sa
                GROUP BY sa.artist_id
            """)
            song_counts = [row['song_count'] for row in cursor.fetchall()]
            bins_songs = {
                '1 song': 0,
                '2-4 songs': 0,
                '5-9 songs': 0,
                '10-19 songs': 0,
                '20+ songs': 0
            }
            for count in song_counts:
                if count == 1:
                    bins_songs['1 song'] += 1
                elif 2 <= count <= 4:
                    bins_songs['2-4 songs'] += 1
                elif 5 <= count <= 9:
                    bins_songs['5-9 songs'] += 1
                elif 10 <= count <= 19:
                    bins_songs['10-19 songs'] += 1
                else:
                    bins_songs['20+ songs'] += 1
            songsPerArtist = [
                { 'name': k, 'value': v } for k, v in bins_songs.items() if v > 0
            ]

            return {
                "artistsPerSong": artistsPerSong,
                "songsPerArtist": songsPerArtist
            }

def get_year_distribution():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT release_year as year, COUNT(*) as count
                FROM song_metadata
                WHERE release_year IS NOT NULL
                GROUP BY release_year
                ORDER BY release_year
            """)
            return cursor.fetchall()

def get_top_genres():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT genre_0 as name, COUNT(*) as count
                FROM song_metadata
                WHERE genre_0 IS NOT NULL
                GROUP BY genre_0
                ORDER BY count DESC
                LIMIT 8
            """)
            return cursor.fetchall()

def get_health_score():
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("SELECT COUNT(*) FROM song_metadata")
            total_songs = cursor.fetchone()["count"]
            cursor.execute("SELECT COUNT(*) FROM artist")
            total_artists = cursor.fetchone()["count"]
            cursor.execute("SELECT COUNT(*) FROM song_artist WHERE is_primary = true")
            primary_relationships = cursor.fetchone()["count"]
            cursor.execute("SELECT COUNT(*) FROM song_metadata WHERE song IS NULL OR artist_0 IS NULL")
            null_values = cursor.fetchone()["count"]
            cursor.execute("""
                SELECT COUNT(*) FROM song_metadata sm
                WHERE NOT EXISTS (SELECT 1 FROM song_artist sa WHERE sa.song_id = sm.id)
            """)
            orphaned_songs = cursor.fetchone()["count"]

            completeness_score = (primary_relationships / max(total_songs, 1)) * 100
            data_quality_score = max(0, 100 - (null_values / max(total_songs, 1)) * 100)
            relationship_score = max(0, 100 - (orphaned_songs / max(total_songs, 1)) * 100)
            overall_health = (completeness_score * 0.4 + data_quality_score * 0.3 + relationship_score * 0.3)

            return {
                'overall_health': overall_health,
                'completeness_score': completeness_score,
                'data_quality_score': data_quality_score,
                'relationship_score': relationship_score,
                'total_songs': total_songs,
                'total_artists': total_artists,
                'primary_relationships': primary_relationships,
                'null_values': null_values,
                'orphaned_songs': orphaned_songs
            }

def search_songs_backend(search_term, limit=50):
    if not search_term or len(search_term.strip()) < 2:
        return []
    search_term = search_term.strip()
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT DISTINCT
                    sm.id,
                    sm.song,
                    sm.artist_0,
                    CASE 
                        WHEN EXISTS (SELECT 1 FROM song_alias sa WHERE sa.song_id = sm.id) 
                        THEN 'Has Aliases' 
                        ELSE 'No Aliases' 
                    END as alias_status,
                    sm.canonical_song_id,
                    CASE 
                        WHEN LOWER(sm.song) LIKE LOWER(%s) THEN 1 
                        ELSE 2 
                    END as search_priority
                FROM song_metadata sm
                WHERE (
                    LOWER(sm.song) LIKE LOWER(%s)
                    OR LOWER(sm.artist_0) LIKE LOWER(%s)
                )
                AND sm.song IS NOT NULL
                AND sm.artist_0 IS NOT NULL
                ORDER BY 
                    search_priority,
                    sm.song
                LIMIT %s
            """, (f'%{search_term}%', f'%{search_term}%', f'%{search_term}%', limit))
            return cursor.fetchall()

def search_artists_backend(search_term, limit=50):
    if not search_term or len(search_term.strip()) < 2:
        return []
    search_term = search_term.strip()
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute("""
                SELECT DISTINCT
                    a.id,
                    a.name,
                    CASE 
                        WHEN EXISTS (SELECT 1 FROM artist_alias aa WHERE aa.artist_id = a.id) 
                        THEN 'Has Aliases' 
                        ELSE 'No Aliases' 
                    END as alias_status,
                    (SELECT COUNT(*) FROM song_artist sa WHERE sa.artist_id = a.id) as song_count,
                    CASE 
                        WHEN LOWER(a.name) LIKE LOWER(%s) THEN 1 
                        ELSE 2 
                    END as search_priority
                FROM artist a
                WHERE LOWER(a.name) LIKE LOWER(%s)
                ORDER BY 
                    search_priority,
                    a.name
                LIMIT %s
            """, (f'{search_term.lower()}%', f'%{search_term}%', limit))
            return cursor.fetchall()

def get_song_variants(song_id):
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Get original song info
            cursor.execute("""
                SELECT id, song, artist_0, canonical_song_id
                FROM song_metadata
                WHERE id = %s
            """, (song_id,))
            original = cursor.fetchone()
            if not original:
                return {"songData": None}
            # Get all aliases for this song
            cursor.execute("""
                SELECT alias, 'Direct Alias' as alias_type
                FROM song_alias
                WHERE song_id = %s
                ORDER BY alias
            """, (song_id,))
            aliases = cursor.fetchall()
            # Get sibling songs (other songs with the same canonical_song_id)
            canonical_id = original.get('canonical_song_id')
            sibling_songs = []
            if canonical_id:
                cursor.execute("""
                    SELECT id, song, artist_0, 'Sibling Song' as relation
                    FROM song_metadata
                    WHERE canonical_song_id = %s AND id != %s
                """, (canonical_id, song_id))
                sibling_songs = cursor.fetchall()
            return {
                "songData": {
                    "original": [original['id'], original['song'], original['artist_0'], original.get('canonical_song_id')],
                    "aliases": [[a['alias'], a['alias_type']] for a in aliases],
                    "sibling_songs": [[s['id'], s['song'], s['artist_0'], s['relation']] for s in sibling_songs]
                }
            }

def get_artist_variants(artist_id):
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            # Get original artist info
            cursor.execute("""
                SELECT id, name
                FROM artist
                WHERE id = %s
            """, (artist_id,))
            original = cursor.fetchone()
            if not original:
                return {"artistData": None}
            # Get all aliases for this artist
            cursor.execute("""
                SELECT alias, 'Direct Alias' as alias_type
                FROM artist_alias
                WHERE artist_id = %s
                ORDER BY alias
            """, (artist_id,))
            aliases = cursor.fetchall()
            # Get song stats
            cursor.execute("""
                SELECT 
                    COUNT(*) as total_songs,
                    COUNT(*) FILTER (WHERE is_primary = true) as primary_songs,
                    COUNT(*) FILTER (WHERE is_primary = false) as featured_songs
                FROM song_artist
                WHERE artist_id = %s
            """, (artist_id,))
            song_stats = cursor.fetchone()
            # Get sample songs
            cursor.execute("""
                SELECT sm.id, sm.song, sa.is_primary
                FROM song_artist sa
                JOIN song_metadata sm ON sa.song_id = sm.id
                WHERE sa.artist_id = %s
                ORDER BY sa.is_primary DESC, sm.song
                LIMIT 10
            """, (artist_id,))
            sample_songs = cursor.fetchall()
            return {
                "artistData": {
                    "original": [original['id'], original['name']],
                    "aliases": [[a['alias'], a['alias_type']] for a in aliases],
                    "song_stats": [song_stats['total_songs'], song_stats['primary_songs'], song_stats['featured_songs']],
                    "sample_songs": [[s['id'], s['song'], s['is_primary']] for s in sample_songs]
                }
            }