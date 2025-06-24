import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MetricCard from '../common/MetricCard';
import LoadingSpinner from '../common/LoadingSpinner';
import TopArtistsBarChart from '../charts/TopArtistsBarChart';
import ArtistProductivityOverTimeChart from '../charts/ArtistProductivityOverTimeChart';
import ArtistAliasesPieChart from '../charts/ArtistAliasesPieChart';
import { 
  fetchDatabaseStats, 
  fetchSecondaryArtistStats, 
  fetchTopArtists,
  fetchYearDistribution,
  fetchTopGenres,
} from '../../services/mockData';

const AnalyticsContainer = styled.div`
  animation: fadeIn 0.3s ease-in-out;
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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
  &:first-child { margin-top: 0; }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
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
  &:last-child { border-bottom: none; }
  @media (max-width: 768px) {
    grid-template-columns: auto 1fr auto;
    gap: 0.5rem;
    .hide-mobile { display: none; }
  }
`;

const CollabTable = styled.table`
  width: 100%;
  margin: 2rem 0;
  border-collapse: collapse;
  background: var(--bg-primary);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  th, td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--border-color);
    text-align: left;
  }
  th {
    background: var(--bg-secondary);
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.95rem;
  }
  tr:last-child td { border-bottom: none; }
`;

const ArtistAnalyticsTab = ({ refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {},
    secondaryStats: {},
    topArtists: [],
    yearDistribution: [],
    topGenres: []
  });

  // Simulated: In real app, fetch from backend
  const [aliasStats, setAliasStats] = useState({ withAliases: 0, withoutAliases: 0 });
  const [productivityData, setProductivityData] = useState([]);
  const [mostCollaborative, setMostCollaborative] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, secondaryStats, topArtists, yearDistribution, topGenres] = await Promise.all([
        fetchDatabaseStats(),
        fetchSecondaryArtistStats(),
        fetchTopArtists(),
        fetchYearDistribution(),
        fetchTopGenres()
      ]);
      setData({ stats, secondaryStats, topArtists, yearDistribution, topGenres });

      // Calculate alias stats
      const withAliases = stats.artist_aliases || 0;
      const withoutAliases = (stats.artists || 0) - withAliases;
      setAliasStats({ withAliases, withoutAliases });

      // Productivity data: count of new artists per year
      // (Assume yearDistribution is [{year, count}] for artists)
      setProductivityData(yearDistribution);

      // Most collaborative artists: sort by featured_count
      setMostCollaborative([...topArtists].sort((a, b) => b.featured_count - a.featured_count).slice(0, 5));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [refreshTrigger]);

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
      <SectionTitle>🎤 Artist Metrics Overview</SectionTitle>
      <MetricsGrid>
        <MetricCard title="Total Artists" value={stats.artists} icon="🎤" color="var(--accent-color)" help="Total number of unique artists in the database" />
        <MetricCard title="Artist Aliases" value={stats.artist_aliases} icon="🏷️" color="var(--success-color)" help="Total artist aliases for better search and matching" />
        <MetricCard title="Most Prolific Artist" value={topArtists[0]?.name || '-'} icon="🏆" color="var(--primary-color)" help="Artist with the most songs" />
        <MetricCard title="Most Collaborative Artist" value={mostCollaborative[0]?.name || '-'} icon="🤝" color="var(--warning-color)" help="Artist with the most featured appearances" />
      </MetricsGrid>

      <SectionTitle>🏆 Top 10 Artists (Primary vs Featured)</SectionTitle>
      <TopArtistsBarChart topArtists={topArtists.slice(0, 10)} />

      <SectionTitle>📈 Artist Productivity Over Time</SectionTitle>
      <ArtistProductivityOverTimeChart productivityData={productivityData} />

      <SectionTitle>🏷️ Artists With vs Without Aliases</SectionTitle>
      <ArtistAliasesPieChart aliasStats={aliasStats} />

      <SectionTitle>🤝 Most Collaborative Artists</SectionTitle>
      <CollabTable>
        <thead>
          <tr>
            <th>#</th>
            <th>Artist</th>
            <th>Total Songs</th>
            <th>Featured Appearances</th>
          </tr>
        </thead>
        <tbody>
          {mostCollaborative.map((artist, idx) => (
            <tr key={artist.id}>
              <td>{idx + 1}</td>
              <td>{artist.name}</td>
              <td>{artist.song_count}</td>
              <td>{artist.featured_count}</td>
            </tr>
          ))}
        </tbody>
      </CollabTable>

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