import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MetricCard from '../common/MetricCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  fetchDatabaseStats, 
  fetchSecondaryArtistStats, 
  fetchTopArtists,
  fetchDistributionData,
  fetchYearDistribution,
  fetchTopGenres,
  simulateNetworkError 
} from '../../services/mockData';

const AnalyticsContainer = styled.div`
  animation: fadeIn 0.3s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 2rem 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:first-child {
    margin-top: 0;
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
`;

const AlertCard = styled.div`
  background: ${props => {
    if (props.type === 'success') return 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)';
    if (props.type === 'warning') return 'linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%)';
    if (props.type === 'danger') return 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)';
    return 'linear-gradient(135deg, #cff4fc 0%, #b6effb 100%)';
  }};
  border: 1px solid ${props => {
    if (props.type === 'success') return '#badbcc';
    if (props.type === 'warning') return '#ffecb5';
    if (props.type === 'danger') return '#f5c2c7';
    return '#b6effb';
  }};
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  color: ${props => {
    if (props.type === 'success') return '#0f5132';
    if (props.type === 'warning') return '#664d03';
    if (props.type === 'danger') return '#842029';
    return '#055160';
  }};
`;

const PlaceholderChart = styled.div`
  background: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 0.75rem;
  padding: 3rem 2rem;
  text-align: center;
  color: var(--text-secondary);
  margin: 2rem 0;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
`;

const TopArtistsList = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const ArtistItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: auto 1fr auto;
    gap: 0.5rem;
    
    .hide-mobile {
      display: none;
    }
  }
`;

const ArtistAnalyticsTab = ({ refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {},
    secondaryStats: {},
    topArtists: [],
    distributionData: { artistsPerSong: [], songsPerArtist: [] },
    yearDistribution: [],
    topGenres: []
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate network check
      simulateNetworkError();
      
      // Fetch all data in parallel
      const [
        stats, 
        secondaryStats, 
        topArtists, 
        distributionData,
        yearDistribution,
        topGenres
      ] = await Promise.all([
        fetchDatabaseStats(),
        fetchSecondaryArtistStats(),
        fetchTopArtists(),
        fetchDistributionData(),
        fetchYearDistribution(),
        fetchTopGenres()
      ]);
      
      setData({
        stats,
        secondaryStats,
        topArtists,
        distributionData,
        yearDistribution,
        topGenres
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <LoadingSpinner 
        size="large"
        text="Loading artist analytics..."
        subtext="Fetching comprehensive artist performance data and charts"
        showDots={true}
      />
    );
  }

  if (error) {
    return (
      <AlertCard type="danger">
        <h4>⚠️ Connection Error</h4>
        <p>Failed to load artist analytics: {error}</p>
        <button 
          className="btn btn-danger btn-sm"
          onClick={loadData}
          style={{ marginTop: '0.5rem' }}
        >
          Retry Connection
        </button>
      </AlertCard>
    );
  }

  const { stats, secondaryStats, topArtists } = data;

  return (
    <AnalyticsContainer>
      <SectionTitle>🎤 Comprehensive Artist Analytics</SectionTitle>

      <SectionTitle>📊 Artist Performance Overview</SectionTitle>
      <MetricsGrid>
        <MetricCard
          title="Total Artists"
          value={stats.artists}
          icon="🎤"
          color="var(--accent-color)"
          help="Total number of unique artists in the database"
        />
        <MetricCard
          title="Artist Aliases"
          value={stats.artist_aliases}
          icon="🏷️"
          color="var(--success-color)"
          help="Total artist aliases for better search and matching"
        />
        <MetricCard
          title="Primary Relationships"
          value={stats.primary_artists}
          icon="🎯"
          color="var(--primary-color)"
          help="Songs where artists appear as primary performer"
        />
        <MetricCard
          title="Featured Relationships"
          value={stats.featured_artists}
          icon="🎼"
          color="var(--warning-color)"
          help="Songs where artists appear as featured performer"
        />
      </MetricsGrid>

      <SectionTitle>🎼 Secondary Artist Deep Dive</SectionTitle>
      <MetricsGrid>
        <MetricCard
          title="Songs with Features"
          value={secondaryStats.songs_with_secondary}
          delta={`${((secondaryStats.songs_with_secondary / stats.songs) * 100).toFixed(1)}% of all songs`}
          icon="🎵"
          color="var(--accent-color)"
          help="Songs containing secondary/featured artists"
        />
        <MetricCard
          title="Unique Featured Artists"
          value={secondaryStats.unique_secondary_count}
          delta={`${(secondaryStats.total_secondary_mentions / secondaryStats.unique_secondary_count).toFixed(1)} avg mentions`}
          icon="🎤"
          color="var(--success-color)"
          help="Distinct artists appearing as features"
        />
        <MetricCard
          title="Feature Rate"
          value={`${((secondaryStats.songs_with_secondary / stats.songs) * 100).toFixed(1)}%`}
          delta={`${secondaryStats.songs_with_secondary.toLocaleString()} feature songs`}
          icon="📈"
          color="var(--primary-color)"
          help="Percentage of songs that include featured artists"
        />
        <MetricCard
          title="Avg Artists per Song"
          value={((stats.song_artist_relations / stats.songs)).toFixed(1)}
          delta="Including all collaborations"
          icon="👥"
          color="var(--warning-color)"
          help="Average number of artists per song across all tracks"
        />
      </MetricsGrid>

      <SectionTitle>🏆 Top 10 Artists</SectionTitle>
      <TopArtistsList>
        <ArtistItem style={{ fontWeight: '600', borderBottom: '2px solid var(--border-color)' }}>
          <div>#</div>
          <div>Artist</div>
          <div>Total</div>
          <div className="hide-mobile">Primary</div>
          <div className="hide-mobile">Featured</div>
        </ArtistItem>
        {topArtists.slice(0, 10).map((artist, index) => (
          <ArtistItem key={artist.id}>
            <div style={{ fontWeight: '600', color: 'var(--accent-color)' }}>
              {index + 1}
            </div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
              {artist.name}
            </div>
            <div>{artist.song_count.toLocaleString()}</div>
            <div className="hide-mobile">{artist.primary_count.toLocaleString()}</div>
            <div className="hide-mobile">{artist.featured_count.toLocaleString()}</div>
          </ArtistItem>
        ))}
      </TopArtistsList>

      <PlaceholderChart>
        <div className="icon">📊</div>
        <h3>Interactive Charts Coming Soon!</h3>
        <p>
          Create the chart component files to see interactive Plotly.js visualizations:
          <br />
          • TopArtistsChart.jsx
          <br />
          • DistributionCharts.jsx  
          <br />
          • YearGenreCharts.jsx
        </p>
      </PlaceholderChart>

      {topArtists.length > 0 && (
        <AlertCard type="success">
          <h4>🎉 Artist Data Loaded Successfully!</h4>
          <p>
            Found {topArtists.length} artists with performance data. 
            Top artist: <strong>{topArtists[0].name}</strong> with {topArtists[0].song_count} songs.
          </p>
        </AlertCard>
      )}
    </AnalyticsContainer>
  );
};

export default ArtistAnalyticsTab;