// Mock data service to simulate the Streamlit dashboard data
// This will be replaced with actual API calls in later batches

export const mockDatabaseStats = {
  songs: 47823,
  artists: 8156,
  song_artist_relations: 65432,
  primary_artists: 45234,
  featured_artists: 20198,
  song_aliases: 12456,
  artist_aliases: 3789,
  setlists: 1245,
  canonical_count: 2156
};

export const mockSecondaryArtistStats = {
  songs_with_secondary: 18456,
  total_secondary_mentions: 23678,
  unique_secondary_count: 5432,
  existing_in_artist_table: 4987,
  missing_from_artist_table: 445,
  missing_relationships: 1234
};

export const mockDeduplicationStats = {
  song_aliases: 12456,
  artist_aliases: 3789,
  songs_without_aliases: 35367,
  artists_without_aliases: 4367,
  canonical_mappings: 2156
};

export const mockDatabaseIssues = {
  orphaned_songs: 234,
  missing_primary: 156,
  inconsistent_artists: 89,
  duplicate_relations: 23,
  orphaned_aliases: 12,
  null_values: 45
};

export const mockTopArtists = [
  { id: 1, name: "Taylor Swift", song_count: 234, primary_count: 198, featured_count: 36 },
  { id: 2, name: "Drake", song_count: 187, primary_count: 156, featured_count: 31 },
  { id: 3, name: "The Beatles", song_count: 156, primary_count: 156, featured_count: 0 },
  { id: 4, name: "Kanye West", song_count: 145, primary_count: 123, featured_count: 22 },
  { id: 5, name: "Beyoncé", song_count: 134, primary_count: 112, featured_count: 22 },
  { id: 6, name: "Ed Sheeran", song_count: 128, primary_count: 98, featured_count: 30 },
  { id: 7, name: "Ariana Grande", song_count: 119, primary_count: 102, featured_count: 17 },
  { id: 8, name: "Eminem", song_count: 115, primary_count: 89, featured_count: 26 },
  { id: 9, name: "Rihanna", song_count: 108, primary_count: 87, featured_count: 21 },
  { id: 10, name: "Justin Bieber", song_count: 98, primary_count: 78, featured_count: 20 }
];

export const mockDistributionData = {
  artistsPerSong: [
    { name: '1 artist', value: 28456 },
    { name: '2 artists', value: 12345 },
    { name: '3 artists', value: 4567 },
    { name: '4+ artists', value: 2455 }
  ],
  songsPerArtist: [
    { name: '1 song', value: 4234 },
    { name: '2-5 songs', value: 2456 },
    { name: '6-20 songs', value: 1234 },
    { name: '20+ songs', value: 232 }
  ]
};

export const mockYearDistribution = [
  { year: 2015, count: 1234 },
  { year: 2016, count: 1456 },
  { year: 2017, count: 1678 },
  { year: 2018, count: 1890 },
  { year: 2019, count: 2123 },
  { year: 2020, count: 2456 },
  { year: 2021, count: 2789 },
  { year: 2022, count: 3012 },
  { year: 2023, count: 3234 },
  { year: 2024, count: 2890 }
];

export const mockTopGenres = [
  { name: 'Pop', count: 12456 },
  { name: 'Hip Hop', count: 9876 },
  { name: 'Rock', count: 8765 },
  { name: 'Electronic', count: 6543 },
  { name: 'R&B', count: 5432 },
  { name: 'Country', count: 4321 },
  { name: 'Jazz', count: 3210 },
  { name: 'Classical', count: 2109 }
];

export const mockRecentSongs = [
  { id: 47823, song: "Anti-Hero", artist_0: "Taylor Swift", created_at: "2024-06-20T15:30:00Z", artist_count: 1 },
  { id: 47822, song: "Flowers", artist_0: "Miley Cyrus", created_at: "2024-06-20T14:45:00Z", artist_count: 1 },
  { id: 47821, song: "Unholy", artist_0: "Sam Smith", created_at: "2024-06-20T13:20:00Z", artist_count: 2 },
  { id: 47820, song: "As It Was", artist_0: "Harry Styles", created_at: "2024-06-20T12:15:00Z", artist_count: 1 },
  { id: 47819, song: "Heat Waves", artist_0: "Glass Animals", created_at: "2024-06-20T11:30:00Z", artist_count: 1 },
  { id: 47818, song: "Bad Habit", artist_0: "Steve Lacy", created_at: "2024-06-20T10:45:00Z", artist_count: 1 },
  { id: 47817, song: "I'm Good (Blue)", artist_0: "David Guetta", created_at: "2024-06-20T09:20:00Z", artist_count: 2 },
  { id: 47816, song: "Creepin'", artist_0: "Metro Boomin", created_at: "2024-06-20T08:15:00Z", artist_count: 3 },
  { id: 47815, song: "Something in the Orange", artist_0: "Zach Bryan", created_at: "2024-06-20T07:30:00Z", artist_count: 1 },
  { id: 47814, song: "About Damn Time", artist_0: "Lizzo", created_at: "2024-06-20T06:45:00Z", artist_count: 1 }
];

// Simulate API calls with realistic delays
export const fetchDatabaseStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDatabaseStats);
    }, Math.random() * 1000 + 500); // 500-1500ms delay
  });
};

export const fetchSecondaryArtistStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSecondaryArtistStats);
    }, Math.random() * 800 + 400);
  });
};

export const fetchDeduplicationStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDeduplicationStats);
    }, Math.random() * 600 + 300);
  });
};

export const fetchDatabaseIssues = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDatabaseIssues);
    }, Math.random() * 700 + 350);
  });
};

export const fetchTopArtists = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTopArtists);
    }, Math.random() * 900 + 450);
  });
};

export const fetchDistributionData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDistributionData);
    }, Math.random() * 800 + 400);
  });
};

export const fetchYearDistribution = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockYearDistribution);
    }, Math.random() * 600 + 300);
  });
};

export const fetchTopGenres = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTopGenres);
    }, Math.random() * 500 + 250);
  });
};

export const fetchRecentSongs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRecentSongs);
    }, Math.random() * 400 + 200);
  });
};

// Simulate database health calculation
export const calculateDatabaseHealth = (stats, issues) => {
  const total_songs = stats.songs || 1;
  const completeness = (stats.primary_artists / total_songs) * 100;
  const total_issues = Object.values(issues).reduce((sum, val) => sum + val, 0);
  const quality_score = Math.max(0, 100 - (total_issues / total_songs) * 100);
  
  return Math.round((completeness * 0.6 + quality_score * 0.4));
};

// Helper function to simulate network errors (5% chance)
export const simulateNetworkError = () => {
  if (Math.random() < 0.05) {
    throw new Error('Network connection failed');
  }
};