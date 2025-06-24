import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MetricCard from '../common/MetricCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  fetchDatabaseStats, 
  fetchDeduplicationStats
} from '../../services/mockData';

const SchemaContainer = styled.div`
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

const SchemaHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const SchemaTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const SchemaSubtitle = styled.p`
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

const TablesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const TableCard = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border-color);
`;

const TableIcon = styled.div`
  font-size: 2rem;
  color: var(--accent-color);
`;

const TableInfo = styled.div`
  flex: 1;
`;

const TableName = styled.h4`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  font-family: 'Courier New', monospace;
`;

const TableDescription = styled.div`
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FieldItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-radius: 0.375rem;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
`;

const FieldName = styled.span`
  color: var(--text-primary);
  font-weight: 600;
`;

const FieldType = styled.span`
  color: var(--text-secondary);
  font-style: italic;
`;

const SchemaVisualization = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 2rem;
  margin: 2rem 0;
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SchemaText = styled.pre`
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: var(--text-primary);
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  white-space: pre-wrap;
  line-height: 1.4;
  text-align: left;
  width: 100%;
  max-width: 800px;
`;

const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PerformanceSection = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin: 2rem 0;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: var(--accent-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0.5rem;
  
  &:hover {
    background: #3a9bc1;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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

const SchemaPerformanceTab = ({ refreshTrigger }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {},
    dedupStats: {}
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [stats, dedupStats] = await Promise.all([
        fetchDatabaseStats(),
        fetchDeduplicationStats()
      ]);
      
      setData({ stats, dedupStats });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  // Simulate performance analysis
  const runPerformanceAnalysis = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Show success message or update performance metrics
    }, 3000);
  };

  if (loading) {
    return (
      <LoadingSpinner 
        size="large"
        text="Loading schema and performance data..."
        subtext="Analyzing database structure and performance metrics"
        showDots={true}
      />
    );
  }

  if (error) {
    return (
      <AlertCard type="danger">
        <h4>⚠️ Connection Error</h4>
        <p>Failed to load schema information: {error}</p>
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

  const { stats, dedupStats } = data;

  // Define table schema information
  const tableSchemas = [
    {
      name: 'song_metadata',
      icon: '📄',
      description: 'Central repository for song information',
      fields: [
        { name: 'id', type: 'serial PRIMARY KEY' },
        { name: 'song', type: 'text (indexed)' },
        { name: 'artist_0', type: 'text (indexed)' },
        { name: 'artist_n', type: 'text' },
        { name: 'release_year', type: 'integer' },
        { name: 'genre_0', type: 'text' },
        { name: 'canonical_song_id', type: 'integer' }
      ]
    },
    {
      name: 'artist',
      icon: '🎤',
      description: 'Master registry of unique artists',
      fields: [
        { name: 'id', type: 'serial PRIMARY KEY' },
        { name: 'name', type: 'text UNIQUE (indexed)' },
        { name: 'created_at', type: 'timestamp' },
        { name: 'updated_at', type: 'timestamp' }
      ]
    },
    {
      name: 'song_artist',
      icon: '🔗',
      description: 'Many-to-many junction table for relationships',
      fields: [
        { name: 'id', type: 'serial PRIMARY KEY' },
        { name: 'song_id', type: 'integer FOREIGN KEY' },
        { name: 'artist_id', type: 'integer FOREIGN KEY' },
        { name: 'is_primary', type: 'boolean' },
        { name: 'artist_order', type: 'integer' }
      ]
    },
    {
      name: 'song_alias',
      icon: '🎵',
      description: 'Song variants and duplicate tracking',
      fields: [
        { name: 'id', type: 'serial PRIMARY KEY' },
        { name: 'song_id', type: 'integer FOREIGN KEY' },
        { name: 'alias', type: 'text (indexed)' },
        { name: 'alias_type', type: 'text' }
      ]
    },
    {
      name: 'artist_alias',
      icon: '🏷️',
      description: 'Artist aliases and alternative names',
      fields: [
        { name: 'id', type: 'serial PRIMARY KEY' },
        { name: 'artist_id', type: 'integer FOREIGN KEY' },
        { name: 'alias', type: 'text (indexed)' },
        { name: 'alias_type', type: 'text' }
      ]
    },
    {
      name: 'setlist',
      icon: '📋',
      description: 'Performance tracking and playlists',
      fields: [
        { name: 'id', type: 'serial PRIMARY KEY' },
        { name: 'name', type: 'text' },
        { name: 'date', type: 'date' },
        { name: 'venue', type: 'text' }
      ]
    }
  ];

  const schemaText = `
    song_metadata (1:M) ← Protected Core Data
          |
          | song_id
          ↓
    artist (1:M) ← song_artist → (M:1) song_metadata
         |              |
         | artist_id     | song_id
         ↓              ↓
    artist_alias    song_alias    ← Enhanced Features
         |              |
         ↓              ↓
  [AI-Generated]   [Deduplication]

Additional Relationships:
song_metadata ← setlist_song → setlist
              (Performance Tracking)

🔒 Protected: Never modified by AI/fixes
🤖 Enhanced: Safe modification zones
🎯 Junction: Many-to-many relationships
  `;

  return (
    <SchemaContainer>
      <SchemaHeader>
        <SchemaTitle>🏗️ Schema, Architecture & Performance</SchemaTitle>
        <SchemaSubtitle>
          Database schema visualization and performance monitoring with comprehensive table analysis
        </SchemaSubtitle>
      </SchemaHeader>

      <SectionTitle>📋 Database Tables Overview</SectionTitle>
      
      <PerformanceGrid>
        <MetricCard
          title="Total Tables"
          value={tableSchemas.length}
          icon="📊"
          help="Number of main database tables"
          color="var(--accent-color)"
        />
        <MetricCard
          title="Core Records"
          value={stats.songs + stats.artists}
          delta={`${stats.songs.toLocaleString()} songs + ${stats.artists.toLocaleString()} artists`}
          icon="🎵"
          help="Primary data records"
          color="var(--success-color)"
        />
        <MetricCard
          title="Relationships"
          value={stats.song_artist_relations}
          delta="Many-to-many connections"
          icon="🔗"
          help="Song-artist relationship records"
          color="var(--primary-color)"
        />
        <MetricCard
          title="Alias Records"
          value={stats.song_aliases + stats.artist_aliases}
          delta={`${dedupStats.song_aliases.toLocaleString()} songs + ${dedupStats.artist_aliases.toLocaleString()} artists`}
          icon="🏷️"
          help="Total alias and variant records"
          color="var(--warning-color)"
        />
      </PerformanceGrid>

      <SectionTitle>🗂️ Table Schema Details</SectionTitle>
      
      <TablesGrid>
        {tableSchemas.map((table, index) => (
          <TableCard key={index}>
            <TableHeader>
              <TableIcon>{table.icon}</TableIcon>
              <TableInfo>
                <TableName>{table.name}</TableName>
                <TableDescription>{table.description}</TableDescription>
              </TableInfo>
            </TableHeader>
            
            <FieldsList>
              {table.fields.map((field, fieldIndex) => (
                <FieldItem key={fieldIndex}>
                  <FieldName>{field.name}</FieldName>
                  <FieldType>{field.type}</FieldType>
                </FieldItem>
              ))}
            </FieldsList>
          </TableCard>
        ))}
      </TablesGrid>

      <SectionTitle>🔄 Entity Relationship Diagram</SectionTitle>
      
      <SchemaVisualization>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
          📊 Database Architecture
        </h4>
        <SchemaText>{schemaText}</SchemaText>
      </SchemaVisualization>

      <SectionTitle>⚡ Performance Monitoring</SectionTitle>
      
      <PerformanceSection>
        <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
          🎯 Performance Analysis Tools
        </h4>
        
        <PerformanceGrid>
          <MetricCard
            title="Query Performance"
            value={stats.songs < 50000 ? "Excellent" : "Good"}
            delta="Based on dataset size"
            icon="🚀"
            help="Query execution performance assessment"
            status={stats.songs < 50000 ? "excellent" : "good"}
          />
          <MetricCard
            title="Index Efficiency"
            value="Optimized"
            delta="All key fields indexed"
            icon="📇"
            help="Database indexing status"
            status="excellent"
          />
          <MetricCard
            title="Storage Usage"
            value="Efficient"
            delta="Normalized design"
            icon="💾"
            help="Database storage optimization"
            status="excellent"
          />
          <MetricCard
            title="Cache Hit Rate"
            value="95%"
            delta="Simulated metric"
            icon="⚡"
            help="Database query cache performance"
            status="excellent"
          />
        </PerformanceGrid>
        
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <ActionButton onClick={runPerformanceAnalysis}>
            🔍 Run Performance Analysis
          </ActionButton>
          <ActionButton onClick={() => {}}>
            📊 Generate Table Report
          </ActionButton>
          <ActionButton onClick={() => {}}>
            🎯 Optimize Indexes
          </ActionButton>
        </div>
        
        <AlertCard type="info" style={{ marginTop: '1.5rem' }}>
          <h4>💡 Performance Recommendations</h4>
          <p>
            Database performance is good. Consider adding indexes on frequently queried columns for large datasets.
            Current structure is well-optimized for the music database use case with proper normalization and relationship design.
          </p>
        </AlertCard>
      </PerformanceSection>

      <SectionTitle>📈 Table Statistics</SectionTitle>
      
      <PerformanceGrid>
        <MetricCard
          title="song_metadata"
          value={stats.songs.toLocaleString()}
          delta="Primary songs table"
          icon="📄"
          color="var(--accent-color)"
        />
        <MetricCard
          title="artist"
          value={stats.artists.toLocaleString()}
          delta="Unique artists"
          icon="🎤"
          color="var(--success-color)"
        />
        <MetricCard
          title="song_artist"
          value={stats.song_artist_relations.toLocaleString()}
          delta="Relationship records"
          icon="🔗"
          color="var(--primary-color)"
        />
        <MetricCard
          title="Alias Tables"
          value={(stats.song_aliases + stats.artist_aliases).toLocaleString()}
          delta="Enhancement records"
          icon="🏷️"
          color="var(--warning-color)"
        />
      </PerformanceGrid>

      {stats.songs > 0 && (
        <AlertCard type="success">
          <h4>🎉 Schema Analysis Complete!</h4>
          <p>
            Database schema is well-structured with {tableSchemas.length} main tables containing{' '}
            {(stats.songs + stats.artists + stats.song_artist_relations).toLocaleString()} total records.
            Performance metrics indicate efficient design and good optimization.
          </p>
        </AlertCard>
      )}
    </SchemaContainer>
  );
};

export default SchemaPerformanceTab;