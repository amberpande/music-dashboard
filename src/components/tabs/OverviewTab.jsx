import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MetricCard from '../common/MetricCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  fetchDatabaseStats, 
  fetchSecondaryArtistStats, 
  fetchDeduplicationStats, 
  fetchDatabaseIssues,
  fetchRecentSongs,
} from '../../services/mockData';

const OverviewContainer = styled.div`
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
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

const RecentActivitySection = styled.div`
  background: var(--bg-secondary);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const ActivityList = styled.div`
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActivityItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const SongInfo = styled.div`
  flex: 1;
`;

const SongTitle = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const ArtistName = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const TimeStamp = styled.div`
  color: var(--text-muted);
  font-size: 0.8rem;
  white-space: nowrap;
`;

const OverviewTab = ({ refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {},
    secondaryStats: {},
    dedupStats: {},
    issues: {},
    recentSongs: [],
    healthScore: 0
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch all data in parallel
      const [stats, secondaryStats, dedupStats, issues, recentSongs] = await Promise.all([
        fetchDatabaseStats(),
        fetchSecondaryArtistStats(),
        fetchDeduplicationStats(),
        fetchDatabaseIssues(),
        fetchRecentSongs()
      ]);
      
      setData({
        stats,
        secondaryStats,
        dedupStats,
        issues,
        recentSongs,
        healthScore: 0 // Placeholder for health score, actual implementation needed
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

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getHealthStatus = (score) => {
    if (score >= 90) return { status: 'excellent', text: 'Excellent', color: 'var(--success-color)' };
    if (score >= 75) return { status: 'good', text: 'Good', color: 'var(--warning-color)' };
    return { status: 'poor', text: 'Needs Attention', color: 'var(--error-color)' };
  };

  if (loading) {
    return (
      <LoadingSpinner 
        size="large"
        text="Loading database overview..."
        subtext="Fetching comprehensive statistics and health metrics"
        showDots={true}
      />
    );
  }

  if (error) {
    return (
      <AlertCard type="danger">
        <h4>⚠️ Connection Error</h4>
        <p>Failed to load database statistics: {error}</p>
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

  const { stats, secondaryStats, dedupStats, issues, recentSongs, healthScore } = data;
  const health = getHealthStatus(healthScore);
  const totalIssues = Object.values(issues).reduce((sum, val) => sum + val, 0);

  return (
    <OverviewContainer>
      <SectionTitle>📊 Core Database Statistics</SectionTitle>
      <MetricsGrid>
        <MetricCard
          title="Total Songs"
          value={stats.songs}
          icon="🎵"
          help="Total number of songs in the database"
          color="var(--accent-color)"
        />
        <MetricCard
          title="Total Artists"
          value={stats.artists}
          icon="🎤"
          help="Total number of unique artists"
          color="var(--success-color)"
        />
        <MetricCard
          title="Total Relationships"
          value={stats.song_artist_relations}
          icon="🔗"
          help="Total song-artist relationships"
          color="var(--primary-color)"
        />
        <MetricCard
          title="Primary Coverage"
          value={`${((stats.primary_artists / stats.songs) * 100).toFixed(1)}%`}
          delta={`${stats.songs - stats.primary_artists} missing`}
          deltaColor={stats.primary_artists >= stats.songs * 0.95 ? 'normal' : 'inverse'}
          icon="🎯"
          help="Percentage of songs with primary artist assigned"
          color="var(--warning-color)"
        />
      </MetricsGrid>

      <SectionTitle>🎼 Secondary Artist Statistics</SectionTitle>
      <MetricsGrid>
        <MetricCard
          title="Songs with Features"
          value={secondaryStats.songs_with_secondary}
          delta={`${((secondaryStats.songs_with_secondary / stats.songs) * 100).toFixed(1)}% of all songs`}
          icon="🎵"
          help="Songs containing secondary/featured artists"
          color="var(--accent-color)"
        />
        <MetricCard
          title="Unique Featured Artists"
          value={secondaryStats.unique_secondary_count}
          delta={`${(secondaryStats.total_secondary_mentions / secondaryStats.unique_secondary_count).toFixed(1)} avg mentions`}
          icon="🎤"
          help="Distinct artists appearing as features"
          color="var(--success-color)"
        />
        <MetricCard
          title="Artist Table Coverage"
          value={`${((secondaryStats.existing_in_artist_table / secondaryStats.unique_secondary_count) * 100).toFixed(1)}%`}
          delta={`${secondaryStats.missing_from_artist_table} missing`}
          deltaColor={secondaryStats.missing_from_artist_table === 0 ? 'normal' : 'inverse'}
          icon="🎯"
          help="Featured artists present in artist table"
          color="var(--warning-color)"
        />
        <MetricCard
          title="Relationship Coverage"
          value={`${(((secondaryStats.total_secondary_mentions - secondaryStats.missing_relationships) / secondaryStats.total_secondary_mentions) * 100).toFixed(1)}%`}
          delta={`${secondaryStats.missing_relationships} missing`}
          deltaColor={secondaryStats.missing_relationships === 0 ? 'normal' : 'inverse'}
          icon="🔗"
          help="Featured artists with proper relationships"
          color="var(--primary-color)"
        />
      </MetricsGrid>

      <SectionTitle>🤖 AI-Enhanced Deduplication & Alias Statistics</SectionTitle>
      <MetricsGrid>
        <MetricCard
          title="Song Aliases"
          value={dedupStats.song_aliases}
          delta={`${((dedupStats.song_aliases / stats.songs) * 100).toFixed(1)}% coverage`}
          icon="🎵"
          help="Total song aliases and variants (AI-enhanced)"
          color="var(--accent-color)"
        />
        <MetricCard
          title="Artist Aliases"
          value={dedupStats.artist_aliases}
          delta={`${((dedupStats.artist_aliases / stats.artists) * 100).toFixed(1)}% coverage`}
          icon="🤖"
          help="Total artist aliases (AI-generated and verified)"
          color="var(--success-color)"
        />
        <MetricCard
          title="Unprocessed Songs"
          value={dedupStats.songs_without_aliases}
          delta={`${((dedupStats.songs_without_aliases / stats.songs) * 100).toFixed(1)}% unprocessed`}
          deltaColor={dedupStats.songs_without_aliases > stats.songs * 0.5 ? 'inverse' : dedupStats.songs_without_aliases > stats.songs * 0.2 ? 'off' : 'normal'}
          icon="📄"
          help="Songs not yet processed for deduplication"
          color="var(--warning-color)"
        />
        <MetricCard
          title="Canonical Mappings"
          value={dedupStats.canonical_mappings}
          delta={`${((dedupStats.canonical_mappings / stats.songs) * 100).toFixed(1)}% have duplicates`}
          icon="🔗"
          help="Songs with canonical duplicate references"
          color="var(--primary-color)"
        />
      </MetricsGrid>

      <SectionTitle>⚠️ Data Quality Issues Analysis</SectionTitle>
      
      {totalIssues === 0 ? (
        <AlertCard type="success">
          <h4>🎉 Excellent! No critical issues detected</h4>
          <p>Your database is in perfect health and ready for AI optimization.</p>
        </AlertCard>
      ) : totalIssues < 100 ? (
        <AlertCard type="warning">
          <h4>🟡 Good - {totalIssues} minor issues to address</h4>
          <p>Minor issues found before AI deduplication can proceed.</p>
        </AlertCard>
      ) : (
        <AlertCard type="danger">
          <h4>🔴 Needs Attention - {totalIssues} critical issues</h4>
          <p>Critical issues require immediate attention before AI operations.</p>
        </AlertCard>
      )}

      <MetricsGrid>
        <MetricCard
          title="Missing Primary"
          value={issues.missing_primary}
          delta="Songs without primary artist"
          deltaColor={issues.missing_primary === 0 ? 'normal' : 'inverse'}
          icon="🎯"
          color="var(--error-color)"
        />
        <MetricCard
          title="Inconsistent Artists"
          value={issues.inconsistent_artists}
          delta="Name mismatches"
          deltaColor={issues.inconsistent_artists === 0 ? 'normal' : 'inverse'}
          icon="🔧"
          color="var(--warning-color)"
        />
        <MetricCard
          title="Orphaned Songs"
          value={issues.orphaned_songs}
          delta="Songs without artists"
          deltaColor={issues.orphaned_songs === 0 ? 'normal' : 'inverse'}
          icon="🏠"
          color="var(--error-color)"
        />
        <MetricCard
          title="Health Score"
          value={`${healthScore}%`}
          delta={health.text}
          deltaColor={health.status === 'excellent' ? 'normal' : health.status === 'good' ? 'off' : 'inverse'}
          icon="🏥"
          help="Overall database health based on completeness and issues"
          color={health.color}
          status={health.status}
          animated={true}
        />
      </MetricsGrid>

      <SectionTitle>🆕 Recent Activity</SectionTitle>
      <RecentActivitySection>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
          📅 Most Recently Added Songs
        </h4>
        {recentSongs.length > 0 ? (
          <ActivityList>
            {recentSongs.slice(0, 5).map((song) => (
              <ActivityItem key={song.id}>
                <SongInfo>
                  <SongTitle>{song.song}</SongTitle>
                  <ArtistName>by {song.artist_0}</ArtistName>
                </SongInfo>
                <div style={{ textAlign: 'right' }}>
                  <TimeStamp>{formatTimeAgo(song.created_at)}</TimeStamp>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {song.artist_count} artist{song.artist_count !== 1 ? 's' : ''}
                  </div>
                </div>
              </ActivityItem>
            ))}
          </ActivityList>
        ) : (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>
            No recent activity found
          </p>
        )}
        
        {recentSongs.length > 0 && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <strong>{recentSongs.length}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Recent Songs</div>
              </div>
              <div>
                <strong>{recentSongs.filter(s => s.artist_count > 1).length}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Collaborations</div>
              </div>
              <div>
                <strong>{(recentSongs.reduce((sum, s) => sum + s.artist_count, 0) / recentSongs.length).toFixed(1)}</strong>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Artists</div>
              </div>
            </div>
          </div>
        )}
      </RecentActivitySection>
    </OverviewContainer>
  );
};

export default OverviewTab;