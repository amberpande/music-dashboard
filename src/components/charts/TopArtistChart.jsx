import React from 'react';
import Plot from 'react-plotly.js';
import styled from 'styled-components';

const ChartContainer = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const StatsTable = styled.div`
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  align-items: center;
  
  &:first-child {
    font-weight: 600;
    color: var(--text-primary);
    border-bottom: 2px solid var(--border-color);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 0.5rem;
    
    .hide-mobile {
      display: none;
    }
  }
`;

const InsightsSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 2rem;
`;

const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const InsightCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const TopArtistsChart = ({ topArtists = [] }) => {
  if (!topArtists || topArtists.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>🎤 Top Artists Performance Analysis</ChartTitle>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No artist data available for analysis
        </div>
      </ChartContainer>
    );
  }

  // Prepare data for charts
  const top10Artists = topArtists.slice(0, 10);
  
  // Horizontal bar chart data
  const totalSongsData = {
    x: top10Artists.map(artist => artist.song_count),
    y: top10Artists.map(artist => artist.name),
    type: 'bar',
    orientation: 'h',
    marker: {
      color: top10Artists.map((_, index) => 
        `rgba(102, 126, 234, ${1 - (index * 0.08)})`
      ),
      line: {
        color: 'rgba(102, 126, 234, 1)',
        width: 1
      }
    },
    text: top10Artists.map(artist => artist.song_count),
    textposition: 'outside',
    hovertemplate: '<b>%{y}</b><br>Total Songs: %{x}<extra></extra>'
  };

  // Stacked bar chart data for primary vs featured
  const primaryData = {
    x: top10Artists.map(artist => artist.name),
    y: top10Artists.map(artist => artist.primary_count),
    type: 'bar',
    name: 'Primary Artist',
    marker: { color: '#667eea' },
    hovertemplate: '<b>%{x}</b><br>Primary: %{y}<extra></extra>'
  };

  const featuredData = {
    x: top10Artists.map(artist => artist.name),
    y: top10Artists.map(artist => artist.featured_count),
    type: 'bar',
    name: 'Featured Artist',
    marker: { color: '#ff7f0e' },
    hovertemplate: '<b>%{x}</b><br>Featured: %{y}<extra></extra>'
  };

  // Chart layouts
  const totalSongsLayout = {
    title: {
      text: 'Total Songs per Artist',
      font: { family: 'Source Sans Pro', size: 16, color: 'var(--text-primary)' }
    },
    xaxis: {
      title: 'Number of Songs',
      gridcolor: 'rgba(0,0,0,0.1)',
      font: { family: 'Source Sans Pro' }
    },
    yaxis: {
      categoryorder: 'total ascending',
      font: { family: 'Source Sans Pro' }
    },
    margin: { l: 150, r: 50, t: 50, b: 50 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Source Sans Pro' }
  };

  const stackedLayout = {
    title: {
      text: 'Primary vs Featured Appearances',
      font: { family: 'Source Sans Pro', size: 16, color: 'var(--text-primary)' }
    },
    xaxis: {
      title: 'Artist',
      tickangle: 45,
      font: { family: 'Source Sans Pro' }
    },
    yaxis: {
      title: 'Number of Songs',
      gridcolor: 'rgba(0,0,0,0.1)',
      font: { family: 'Source Sans Pro' }
    },
    barmode: 'stack',
    margin: { l: 50, r: 50, t: 50, b: 100 },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Source Sans Pro' },
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: -0.2
    }
  };

  // Calculate insights
  const mostProlific = top10Artists[0];
  const topCollaborator = top10Artists.reduce((prev, current) => 
    (prev.featured_count > current.featured_count) ? prev : current
  );
  const avgSongs = top10Artists.reduce((sum, artist) => sum + artist.song_count, 0) / top10Artists.length;

  // Calculate detailed stats for table
  const detailedStats = top10Artists.map(artist => ({
    ...artist,
    collaboration_ratio: ((artist.featured_count / artist.song_count) * 100).toFixed(1),
    primary_ratio: ((artist.primary_count / artist.song_count) * 100).toFixed(1)
  }));

  const plotConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    responsive: true
  };

  return (
    <div>
      <ChartTitle>🎤 Top Artists Performance Analysis</ChartTitle>
      
      <ChartsGrid>
        <ChartContainer>
          <Plot
            data={[totalSongsData]}
            layout={totalSongsLayout}
            config={plotConfig}
            style={{ width: '100%', height: '400px' }}
            useResizeHandler={true}
          />
        </ChartContainer>

        <ChartContainer>
          <Plot
            data={[primaryData, featuredData]}
            layout={stackedLayout}
            config={plotConfig}
            style={{ width: '100%', height: '400px' }}
            useResizeHandler={true}
          />
        </ChartContainer>
      </ChartsGrid>

      <ChartContainer>
        <ChartTitle>📊 Detailed Artist Statistics</ChartTitle>
        <StatsTable>
          <TableRow>
            <div>Artist</div>
            <div>Total Songs</div>
            <div>Primary</div>
            <div>Featured</div>
            <div className="hide-mobile">Primary %</div>
            <div className="hide-mobile">Collab %</div>
          </TableRow>
          {detailedStats.map((artist, index) => (
            <TableRow key={artist.id}>
              <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                {artist.name}
              </div>
              <div>{artist.song_count.toLocaleString()}</div>
              <div>{artist.primary_count.toLocaleString()}</div>
              <div>{artist.featured_count.toLocaleString()}</div>
              <div className="hide-mobile">{artist.primary_ratio}%</div>
              <div className="hide-mobile">{artist.collaboration_ratio}%</div>
            </TableRow>
          ))}
        </StatsTable>
      </ChartContainer>

      <InsightsSection>
        <h4 style={{ margin: '0 0 1rem 0', color: 'white' }}>🔍 Key Insights</h4>
        <InsightGrid>
          <InsightCard>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              🏆
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Most Prolific Artist</div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              {mostProlific.name}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              {mostProlific.song_count} songs
            </div>
          </InsightCard>

          <InsightCard>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              🤝
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Top Collaborator</div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              {topCollaborator.name}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              {topCollaborator.featured_count} features
            </div>
          </InsightCard>

          <InsightCard>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              📊
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Average Songs</div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              {avgSongs.toFixed(1)}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
              Among top {top10Artists.length} artists
            </div>
          </InsightCard>
        </InsightGrid>
      </InsightsSection>
    </div>
  );
};

export default TopArtistsChart;