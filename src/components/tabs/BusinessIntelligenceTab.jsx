import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MetricCard from '../common/MetricCard';
import LoadingSpinner from '../common/LoadingSpinner';
import TopArtistsChart from '../charts/TopArtistChart';
import DistributionCharts from '../charts/DistributionCharts';
import YearGenreCharts from '../charts/YearGenreCharts';
import { 
  fetchDatabaseStats, 
  fetchSecondaryArtistStats, 
  fetchDeduplicationStats, 
  fetchDatabaseIssues,
  fetchTopArtists,
  fetchDistributionData,
  fetchYearDistribution,
  fetchTopGenres,
  simulateNetworkError 
} from '../../services/mockData';

const BIContainer = styled.div`
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

const BIHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const BITitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const BISubtitle = styled.p`
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
`;

const SectionTitle = styled.h3`
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

const ExecutiveSummary = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
`;

const SummaryCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const SummaryValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const SummaryLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.9;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StrategicSection = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 2rem;
  margin: 2rem 0;
  box-shadow: var(--shadow-sm);
`;

const RecommendationsList = styled.div`
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const RecommendationCard = styled.div`
  background: ${props => {
    if (props.priority === 'high') return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    if (props.priority === 'medium') return 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)';
    return 'linear-gradient(135deg, #42a5f5 0%, #2196f3 100%)';
  }};
  color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RecommendationIcon = styled.div`
  font-size: 2rem;
  min-width: 60px;
  text-align: center;
`;

const RecommendationContent = styled.div`
  flex: 1;
`;

const RecommendationTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
`;

const RecommendationText = styled.p`
  margin: 0;
  opacity: 0.9;
  line-height: 1.4;
`;

const HealthScoreSection = styled.div`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  margin: 2rem 0;
  text-align: center;
`;

const HealthScore = styled.div`
  font-size: 4rem;
  font-weight: 700;
  margin: 1rem 0;
`;

const HealthStatus = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const HealthDescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
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

const BusinessIntelligenceTab = ({ refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {},
    secondaryStats: {},
    dedupStats: {},
    issues: {},
    topArtists: [],
    distributionData: { artistsPerSong: [], songsPerArtist: [] },
    yearDistribution: [],
    topGenres: []
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      simulateNetworkError();
      
      const [
        stats,
        secondaryStats,
        dedupStats,
        issues,
        topArtists,
        distributionData,
        yearDistribution,
        topGenres
      ] = await Promise.all([
        fetchDatabaseStats(),
        fetchSecondaryArtistStats(),
        fetchDeduplicationStats(),
        fetchDatabaseIssues(),
        fetchTopArtists(),
        fetchDistributionData(),
        fetchYearDistribution(),
        fetchTopGenres()
      ]);
      
      setData({
        stats,
        secondaryStats,
        dedupStats,
        issues,
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

  // Calculate business metrics
  const calculateBusinessMetrics = () => {
    const { stats, secondaryStats, dedupStats, issues } = data;
    
    // Data completeness
    const totalSongs = stats.songs || 1;
    const completeSongs = stats.primary_artists || 0;
    const completeness = (completeSongs / totalSongs) * 100;
    
    // Collaboration rate
    const totalRelations = stats.song_artist_relations || 1;
    const featuredRelations = stats.featured_artists || 0;
    const collabRate = (featuredRelations / totalRelations) * 100;
    
    // AI enhancement potential
    const unprocessedArtists = dedupStats.artists_without_aliases || 0;
    const aiPotential = (unprocessedArtists / Math.max(stats.artists || 1, 1)) * 100;
    
    // Health score
    const totalIssues = Object.values(issues).reduce((sum, val) => sum + val, 0);
    const healthScore = totalIssues === 0 ? 100 : Math.max(0, 100 - (totalIssues / 1000 * 100));
    
    return {
      completeness,
      collabRate,
      aiPotential,
      healthScore,
      totalIssues
    };
  };

  // Generate strategic recommendations
  const generateRecommendations = (metrics) => {
    const recommendations = [];
    
    if (metrics.completeness < 95) {
      recommendations.push({
        priority: 'high',
        icon: '🎯',
        title: 'Data Quality Enhancement',
        text: 'Address missing primary artist assignments to improve data completeness and unlock advanced analytics capabilities.'
      });
    }
    
    if (metrics.collabRate < 20) {
      recommendations.push({
        priority: 'medium',
        icon: '🤝',
        title: 'Collaboration Tracking',
        text: 'Enhance secondary artist relationship tracking to better understand collaboration patterns and network effects.'
      });
    }
    
    if (metrics.aiPotential > 50) {
      recommendations.push({
        priority: 'medium',
        icon: '🤖',
        title: 'AI-Powered Optimization',
        text: 'Implement comprehensive song and artist deduplication using AI to improve search accuracy and data quality.'
      });
    }
    
    if (metrics.healthScore < 80) {
      recommendations.push({
        priority: 'high',
        icon: '🏥',
        title: 'Database Health',
        text: 'Execute comprehensive fix operations to resolve data integrity issues and optimize performance.'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'low',
        icon: '🎉',
        title: 'Excellent Performance',
        text: 'Your database is operating at optimal levels. Consider implementing advanced analytics and monitoring for continued excellence.'
      });
    }
    
    return recommendations;
  };

  if (loading) {
    return (
      <LoadingSpinner 
        size="large"
        text="Loading business intelligence data..."
        subtext="Analyzing strategic metrics and generating insights"
        showDots={true}
      />
    );
  }

  if (error) {
    return (
      <AlertCard type="danger">
        <h4>⚠️ Connection Error</h4>
        <p>Failed to load business intelligence data: {error}</p>
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

  const { stats, secondaryStats, topArtists, distributionData, yearDistribution, topGenres } = data;
  const metrics = calculateBusinessMetrics();
  const recommendations = generateRecommendations(metrics);

  // Health status determination
  const getHealthStatus = () => {
    if (metrics.healthScore >= 90) return { text: 'Excellent', color: '#4ade80', icon: '🟢' };
    if (metrics.healthScore >= 75) return { text: 'Good', color: '#fbbf24', icon: '🟡' };
    return { text: 'Needs Attention', color: '#ef4444', icon: '🔴' };
  };

  const healthStatus = getHealthStatus();

  return (
    <BIContainer>
      <BIHeader>
        <BITitle>📈 Business Intelligence & Strategic Analytics</BITitle>
        <BISubtitle>
          Executive dashboard with comprehensive insights, strategic recommendations, and data-driven decision support
        </BISubtitle>
      </BIHeader>

      <SectionTitle>📊 Executive Summary</SectionTitle>
      
      <ExecutiveSummary>
        <SummaryTitle>Key Performance Indicators</SummaryTitle>
        <SummaryGrid>
          <SummaryCard>
            <SummaryValue>{metrics.completeness.toFixed(1)}%</SummaryValue>
            <SummaryLabel>Data Completeness</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{metrics.collabRate.toFixed(1)}%</SummaryValue>
            <SummaryLabel>Collaboration Rate</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{metrics.aiPotential.toFixed(1)}%</SummaryValue>
            <SummaryLabel>AI Optimization Potential</SummaryLabel>
          </SummaryCard>
          <SummaryCard>
            <SummaryValue>{metrics.healthScore.toFixed(0)}%</SummaryValue>
            <SummaryLabel>Overall Health Score</SummaryLabel>
          </SummaryCard>
        </SummaryGrid>
      </ExecutiveSummary>

      <SectionTitle>🎯 Strategic Metrics</SectionTitle>
      
      <MetricsGrid>
        <MetricCard
          title="Data Completeness"
          value={`${metrics.completeness.toFixed(1)}%`}
          delta={`${stats.songs - stats.primary_artists} incomplete records`}
          deltaColor={metrics.completeness >= 95 ? 'normal' : 'inverse'}
          icon="📊"
          help="Percentage of songs with complete artist relationships"
          color="var(--accent-color)"
        />
        <MetricCard
          title="Collaboration Index"
          value={`${metrics.collabRate.toFixed(1)}%`}
          delta={`${stats.featured_artists.toLocaleString()} featured appearances`}
          icon="🤝"
          help="Rate of artist collaborations in the database"
          color="var(--success-color)"
        />
        <MetricCard
          title="Content Diversity"
          value={topGenres.length}
          delta="Unique genres tracked"
          icon="🎵"
          help="Musical genre diversity in the catalog"
          color="var(--primary-color)"
        />
        <MetricCard
          title="Network Strength"
          value={stats.artists.toLocaleString()}
          delta={`${(stats.song_artist_relations / stats.songs).toFixed(1)} avg connections`}
          icon="🕸️"
          help="Artist network size and connectivity"
          color="var(--warning-color)"
        />
      </MetricsGrid>

      <HealthScoreSection>
        <SummaryTitle>🏥 Database Health Assessment</SummaryTitle>
        <HealthScore style={{ color: healthStatus.color }}>
          {healthStatus.icon} {metrics.healthScore.toFixed(0)}%
        </HealthScore>
        <HealthStatus>{healthStatus.text}</HealthStatus>
        <HealthDescription>
          {metrics.totalIssues === 0 
            ? "Perfect health! Your database is optimally configured and ready for advanced analytics."
            : metrics.totalIssues < 100 
            ? `Good condition with ${metrics.totalIssues} minor issues to address for optimal performance.`
            : `${metrics.totalIssues} issues detected that require attention for optimal database health.`
          }
        </HealthDescription>
      </HealthScoreSection>

      <SectionTitle>📈 Performance Analytics</SectionTitle>
      
      {topArtists.length > 0 && (
        <TopArtistsChart topArtists={topArtists} />
      )}
      
      {(distributionData.artistsPerSong.length > 0 || distributionData.songsPerArtist.length > 0) && (
        <DistributionCharts 
          artistsPerSong={distributionData.artistsPerSong}
          songsPerArtist={distributionData.songsPerArtist}
        />
      )}
      
      {(yearDistribution.length > 0 || topGenres.length > 0) && (
        <YearGenreCharts 
          yearDistribution={yearDistribution}
          topGenres={topGenres}
        />
      )}

      <SectionTitle>💡 Strategic Recommendations</SectionTitle>
      
      <StrategicSection>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
          🎯 Action Plan for Database Optimization
        </h4>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Based on current metrics and industry best practices, here are prioritized recommendations
          for improving your music database performance and capabilities.
        </p>
        
        <RecommendationsList>
          {recommendations.map((rec, index) => (
            <RecommendationCard key={index} priority={rec.priority}>
              <RecommendationIcon>{rec.icon}</RecommendationIcon>
              <RecommendationContent>
                <RecommendationTitle>{rec.title}</RecommendationTitle>
                <RecommendationText>{rec.text}</RecommendationText>
              </RecommendationContent>
            </RecommendationCard>
          ))}
        </RecommendationsList>
      </StrategicSection>

      <SectionTitle>📊 Business Insights</SectionTitle>
      
      <MetricsGrid>
        <MetricCard
          title="Market Coverage"
          value={`${secondaryStats.songs_with_secondary.toLocaleString()}`}
          delta={`${((secondaryStats.songs_with_secondary / stats.songs) * 100).toFixed(1)}% feature rate`}
          icon="📈"
          help="Songs with collaborative artists indicating market diversity"
        />
        <MetricCard
          title="Artist Productivity"
          value={`${(stats.songs / stats.artists).toFixed(1)}`}
          delta="Songs per artist average"
          icon="🎯"
          help="Average productivity metric across all artists"
        />
        <MetricCard
          title="Data Quality Score"
          value={`${metrics.completeness.toFixed(0)}%`}
          delta={metrics.completeness >= 95 ? "Excellent" : "Needs improvement"}
          deltaColor={metrics.completeness >= 95 ? 'normal' : 'inverse'}
          icon="✨"
          help="Overall data quality and completeness assessment"
        />
        <MetricCard
          title="Growth Potential"
          value={`${metrics.aiPotential.toFixed(0)}%`}
          delta="AI optimization opportunity"
          deltaColor={metrics.aiPotential > 50 ? 'inverse' : 'normal'}
          icon="🚀"
          help="Potential for AI-driven improvements and optimizations"
        />
      </MetricsGrid>

      {stats.songs > 0 && (
        <AlertCard type="success">
          <h4>🎉 Business Intelligence Analysis Complete!</h4>
          <p>
            Successfully analyzed {stats.songs.toLocaleString()} songs and {stats.artists.toLocaleString()} artists
            with {stats.song_artist_relations.toLocaleString()} relationships. Health score: {metrics.healthScore.toFixed(0)}%.
            {recommendations.length} strategic recommendations generated for optimization.
          </p>
        </AlertCard>
      )}
    </BIContainer>
  );
};

export default BusinessIntelligenceTab;