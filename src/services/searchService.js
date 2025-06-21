// Search service to simulate PostgreSQL-compatible search functionality
// This mimics the search functions from the Streamlit dashboard

import { 
  mockTopArtists, 
  mockRecentSongs, 
  mockDatabaseStats,
  simulateNetworkError 
} from './mockData';

// Extended mock data for search functionality
const mockSongsDatabase = [
  // Recent songs + additional mock songs for better search results
  ...mockRecentSongs,
  { id: 47813, song: "Shake It Off", artist_0: "Taylor Swift", created_at: "2024-06-19T15:30:00Z", artist_count: 1, genre_0: "Pop", release_year: 2014, album: "1989" },
  { id: 47812, song: "Blinding Lights", artist_0: "The Weeknd", created_at: "2024-06-19T14:20:00Z", artist_count: 1, genre_0: "Pop", release_year: 2019, album: "After Hours" },
  { id: 47811, song: "Shape of You", artist_0: "Ed Sheeran", created_at: "2024-06-19T13:15:00Z", artist_count: 1, genre_0: "Pop", release_year: 2017, album: "÷" },
  { id: 47810, song: "Watermelon Sugar", artist_0: "Harry Styles", created_at: "2024-06-19T12:45:00Z", artist_count: 1, genre_0: "Pop", release_year: 2020, album: "Fine Line" },
  { id: 47809, song: "Levitating", artist_0: "Dua Lipa", created_at: "2024-06-19T11:30:00Z", artist_count: 1, genre_0: "Pop", release_year: 2020, album: "Future Nostalgia" },
  { id: 47808, song: "Good 4 U", artist_0: "Olivia Rodrigo", created_at: "2024-06-19T10:20:00Z", artist_count: 1, genre_0: "Pop Rock", release_year: 2021, album: "SOUR" },
  { id: 47807, song: "Stay", artist_0: "The Kid LAROI", created_at: "2024-06-19T09:15:00Z", artist_count: 2, genre_0: "Pop", release_year: 2021, album: "Stay" },
  { id: 47806, song: "Industry Baby", artist_0: "Lil Nas X", created_at: "2024-06-19T08:45:00Z", artist_count: 2, genre_0: "Hip Hop", release_year: 2021, album: "MONTERO" },
  { id: 47805, song: "Peaches", artist_0: "Justin Bieber", created_at: "2024-06-19T07:30:00Z", artist_count: 3, genre_0: "R&B", release_year: 2021, album: "Justice" },
  { id: 47804, song: "Drivers License", artist_0: "Olivia Rodrigo", created_at: "2024-06-19T06:20:00Z", artist_count: 1, genre_0: "Pop", release_year: 2021, album: "SOUR" },
  { id: 47803, song: "Positions", artist_0: "Ariana Grande", created_at: "2024-06-18T22:15:00Z", artist_count: 1, genre_0: "R&B", release_year: 2020, album: "Positions" },
  { id: 47802, song: "Willow", artist_0: "Taylor Swift", created_at: "2024-06-18T21:30:00Z", artist_count: 1, genre_0: "Alternative", release_year: 2020, album: "evermore" },
  { id: 47801, song: "Therefore I Am", artist_0: "Billie Eilish", created_at: "2024-06-18T20:45:00Z", artist_count: 1, genre_0: "Alternative", release_year: 2020, album: "Therefore I Am" },
  { id: 47800, song: "Mood", artist_0: "24kGoldn", created_at: "2024-06-18T19:20:00Z", artist_count: 2, genre_0: "Hip Hop", release_year: 2020, album: "Mood" },
  { id: 47799, song: "Watermelon Sugar (Remix)", artist_0: "Harry Styles", created_at: "2024-06-18T18:15:00Z", artist_count: 1, genre_0: "Pop", release_year: 2020, album: "Fine Line (Deluxe)" },
  { id: 47798, song: "Circles", artist_0: "Post Malone", created_at: "2024-06-18T17:30:00Z", artist_count: 1, genre_0: "Pop", release_year: 2019, album: "Hollywood's Bleeding" },
  { id: 47797, song: "Don't Start Now", artist_0: "Dua Lipa", created_at: "2024-06-18T16:45:00Z", artist_count: 1, genre_0: "Pop", release_year: 2019, album: "Future Nostalgia" },
  { id: 47796, song: "Adore You", artist_0: "Harry Styles", created_at: "2024-06-18T15:20:00Z", artist_count: 1, genre_0: "Pop", release_year: 2019, album: "Fine Line" },
  { id: 47795, song: "Blinding Lights (Remix)", artist_0: "The Weeknd", created_at: "2024-06-18T14:30:00Z", artist_count: 2, genre_0: "Pop", release_year: 2020, album: "After Hours (Deluxe)" }
];

const mockArtistsDatabase = [
  ...mockTopArtists,
  { id: 11, name: "Billie Eilish", song_count: 89, primary_count: 82, featured_count: 7 },
  { id: 12, name: "Dua Lipa", song_count: 76, primary_count: 71, featured_count: 5 },
  { id: 13, name: "Post Malone", song_count: 68, primary_count: 58, featured_count: 10 },
  { id: 14, name: "Olivia Rodrigo", song_count: 65, primary_count: 63, featured_count: 2 },
  { id: 15, name: "The Weeknd", song_count: 92, primary_count: 85, featured_count: 7 },
  { id: 16, name: "Lil Nas X", song_count: 45, primary_count: 38, featured_count: 7 },
  { id: 17, name: "24kGoldn", song_count: 34, primary_count: 28, featured_count: 6 },
  { id: 18, name: "The Kid LAROI", song_count: 41, primary_count: 35, featured_count: 6 }
];

// Mock aliases data
const mockSongAliases = {
  47823: ["Anti-Hero", "Anti Hero", "Anti-Hero (Taylor's Version)"],
  47822: ["Flowers", "Flowers (Miley Cyrus)", "Miley Cyrus - Flowers"],
  47799: ["Watermelon Sugar (Remix)", "Watermelon Sugar - Remix", "WS Remix"],
  47795: ["Blinding Lights (Remix)", "Blinding Lights - Remix", "BL Remix"],
  47813: ["Shake It Off", "Shake It Off (Taylor's Version)", "Shake It Off - 1989"]
};

const mockArtistAliases = {
  1: ["Taylor Swift", "T-Swift", "Taylor Alison Swift", "Tay"],
  2: ["Drake", "Drizzy", "Aubrey Graham", "6 God"],
  15: ["The Weeknd", "Abel Tesfaye", "Abel", "XO"],
  11: ["Billie Eilish", "Billie", "Billie Eilish Pirate Baird O'Connell"]
};

// Search similarity calculation
const calculateSimilarity = (str1, str2) => {
  if (!str1 || !str2) return 0;
  
  str1 = str1.toLowerCase().trim();
  str2 = str2.toLowerCase().trim();
  
  if (str1 === str2) return 1;
  
  // Simple substring matching for demo
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.8;
  }
  
  // Basic character matching
  const chars1 = str1.split('');
  const chars2 = str2.split('');
  const commonChars = chars1.filter(char => chars2.includes(char));
  
  return commonChars.length / Math.max(chars1.length, chars2.length);
};

// Song search functionality
export const searchSongs = async (searchTerm, limit = 50) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        simulateNetworkError();
        
        if (!searchTerm || searchTerm.length < 2) {
          resolve([]);
          return;
        }
        
        const results = mockSongsDatabase
          .map(song => ({
            ...song,
            alias_status: mockSongAliases[song.id] ? 'Has Aliases' : 'No Aliases',
            canonical_song_id: song.id,
            // Calculate search relevance
            relevance: Math.max(
              calculateSimilarity(song.song, searchTerm),
              calculateSimilarity(song.artist_0, searchTerm)
            )
          }))
          .filter(song => song.relevance > 0.3)
          .sort((a, b) => {
            // Prioritize exact matches
            const aExact = a.song.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
            const bExact = b.song.toLowerCase().includes(searchTerm.toLowerCase()) ? 1 : 0;
            
            if (aExact !== bExact) return bExact - aExact;
            return b.relevance - a.relevance;
          })
          .slice(0, limit)
          .map(({ relevance, ...song }) => song); // Remove relevance from final result
        
        resolve(results);
      } catch (error) {
        reject(error);
      }
    }, Math.random() * 800 + 200);
  });
};

// Artist search functionality
export const searchArtists = async (searchTerm, limit = 50) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        simulateNetworkError();
        
        if (!searchTerm || searchTerm.length < 2) {
          resolve([]);
          return;
        }
        
        const results = mockArtistsDatabase
          .map(artist => ({
            ...artist,
            alias_status: mockArtistAliases[artist.id] ? 'Has Aliases' : 'No Aliases',
            // Calculate search relevance
            relevance: calculateSimilarity(artist.name, searchTerm)
          }))
          .filter(artist => artist.relevance > 0.3)
          .sort((a, b) => {
            // Prioritize exact matches
            const aExact = a.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ? 1 : 0;
            const bExact = b.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ? 1 : 0;
            
            if (aExact !== bExact) return bExact - aExact;
            return b.relevance - a.relevance;
          })
          .slice(0, limit)
          .map(({ relevance, ...artist }) => artist); // Remove relevance from final result
        
        resolve(results);
      } catch (error) {
        reject(error);
      }
    }, Math.random() * 600 + 200);
  });
};

// Get song variants/aliases
export const getSongVariants = async (songId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        simulateNetworkError();
        
        const song = mockSongsDatabase.find(s => s.id === songId);
        if (!song) {
          resolve({ songData: null, variants: [] });
          return;
        }
        
        const aliases = mockSongAliases[songId] || [];
        const siblingSongs = mockSongsDatabase.filter(s => 
          s.id !== songId && 
          s.artist_0 === song.artist_0 && 
          calculateSimilarity(s.song, song.song) > 0.7
        );
        
        const songData = {
          original: [song.id, song.song, song.artist_0, song.canonical_song_id || song.id],
          aliases: aliases.map(alias => [alias, 'Direct Alias']),
          canonical_aliases: [],
          sibling_songs: siblingSongs.map(s => [s.id, s.song, s.artist_0, 'Sibling Song']),
          referring_songs: []
        };
        
        resolve({ songData, variants: aliases });
      } catch (error) {
        reject(error);
      }
    }, Math.random() * 400 + 100);
  });
};

// Get artist variants/aliases
export const getArtistVariants = async (artistId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        simulateNetworkError();
        
        const artist = mockArtistsDatabase.find(a => a.id === artistId);
        if (!artist) {
          resolve({ artistData: null, variants: [] });
          return;
        }
        
        const aliases = mockArtistAliases[artistId] || [];
        const sampleSongs = mockSongsDatabase
          .filter(s => s.artist_0 === artist.name)
          .slice(0, 10)
          .map(s => [s.id, s.song, true]); // Mock as primary for simplicity
        
        const artistData = {
          original: [artist.id, artist.name],
          aliases: aliases.map(alias => [alias, 'Direct Alias']),
          song_stats: [artist.song_count, artist.primary_count, artist.featured_count],
          sample_songs: sampleSongs
        };
        
        resolve({ artistData, variants: aliases });
      } catch (error) {
        reject(error);
      }
    }, Math.random() * 400 + 100);
  });
};

// Advanced search with filters
export const advancedSearch = async (query, filters = {}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        simulateNetworkError();
        
        let results = {
          songs: [],
          artists: []
        };
        
        // Search songs if no type filter or if songs selected
        if (!filters.type || filters.type === 'songs') {
          results.songs = mockSongsDatabase
            .filter(song => {
              let matches = true;
              
              // Text search
              if (query) {
                const textMatch = 
                  song.song.toLowerCase().includes(query.toLowerCase()) ||
                  song.artist_0.toLowerCase().includes(query.toLowerCase());
                matches = matches && textMatch;
              }
              
              // Year filter
              if (filters.year && song.release_year) {
                matches = matches && song.release_year === parseInt(filters.year);
              }
              
              // Genre filter
              if (filters.genre && song.genre_0) {
                matches = matches && song.genre_0.toLowerCase().includes(filters.genre.toLowerCase());
              }
              
              // Artist count filter
              if (filters.artistCount) {
                if (filters.artistCount === 'solo' && song.artist_count !== 1) matches = false;
                if (filters.artistCount === 'collab' && song.artist_count <= 1) matches = false;
              }
              
              return matches;
            })
            .map(song => ({
              ...song,
              alias_status: mockSongAliases[song.id] ? 'Has Aliases' : 'No Aliases'
            }))
            .slice(0, filters.limit || 20);
        }
        
        // Search artists if no type filter or if artists selected
        if (!filters.type || filters.type === 'artists') {
          results.artists = mockArtistsDatabase
            .filter(artist => {
              let matches = true;
              
              // Text search
              if (query) {
                matches = matches && artist.name.toLowerCase().includes(query.toLowerCase());
              }
              
              // Song count filter
              if (filters.minSongs) {
                matches = matches && artist.song_count >= parseInt(filters.minSongs);
              }
              
              if (filters.maxSongs) {
                matches = matches && artist.song_count <= parseInt(filters.maxSongs);
              }
              
              return matches;
            })
            .map(artist => ({
              ...artist,
              alias_status: mockArtistAliases[artist.id] ? 'Has Aliases' : 'No Aliases'
            }))
            .slice(0, filters.limit || 20);
        }
        
        resolve(results);
      } catch (error) {
        reject(error);
      }
    }, Math.random() * 1000 + 300);
  });
};

// Search suggestions/autocomplete
export const getSearchSuggestions = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query || query.length < 2) {
        resolve([]);
        return;
      }
      
      const songSuggestions = mockSongsDatabase
        .filter(song => song.song.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map(song => ({ type: 'song', text: song.song, subtext: `by ${song.artist_0}` }));
      
      const artistSuggestions = mockArtistsDatabase
        .filter(artist => artist.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .map(artist => ({ type: 'artist', text: artist.name, subtext: `${artist.song_count} songs` }));
      
      resolve([...songSuggestions, ...artistSuggestions]);
    }, 200);
  });
};