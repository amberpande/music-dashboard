import React from 'react';
import Plot from 'react-plotly.js';
import styled from 'styled-components';

const ChartsContainer = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 2rem 0 1rem 0;
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

const ChartContainer = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  
  &:hover {
    box-shadow: var(--shadow-md);
  }
`;

const ChartTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  text-align: center;
`;

const InsightBox = styled.div`
  background: var(--bg-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
`;

const CombinedChart = styled.div`
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: var(--shadow-sm);
`;

const DistributionCharts = ({ 
  artistsPerSong = [], 
  songsPerArtist = [] 
}) => {
  if (!artistsPerSong.length && !songsPerArtist.length) {
    return (
      <ChartsContainer>
        <SectionTitle>📊 Distribution Analysis</SectionTitle>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
          No distribution data available
        </div>
      </ChartsContainer>
    );
  }

  // Color schemes
  const pieColors1 = ['#667eea', '#764ba2', '#f093fb', '#f5576c'];
  const pieColors2 = ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];

  // Artists per song pie chart data
  const artistsPerSongData = {
    values: artistsPerSong.map(item => item.value),
    labels: artistsPerSong.map(item => item.name),
    type: 'pie',
    hole: 0.4,
    marker: {
      colors: pieColors1,
      line: {
        color: '#ffffff',
        width: 2
      }
    },
    textinfo: 'label+percent',
    textposition: 'auto',
    hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
  };

  // Songs per artist pie chart data
  const songsPerArtistData = {
    values: songsPerArtist.map(item => item.value),
    labels: songsPerArtist.map(item => item.name),
    type: 'pie',
    hole: 0.4,
    marker: {
      colors: pieColors2,
      line: {
        color: '#ffffff',
        width: 2
      }
    },
    textinfo: 'label+percent',
    textposition: 'auto',
    hovertemplate: '<b>%{label}</b><br>Count: %{value}<br>Percentage: %{percent}<extra></extra>'
  };

  // Layouts for pie charts
  const pieLayout1 = {
    title: {
      text: 'Distribution of Artist Count per Song',
      font: { family: 'Source Sans Pro', size: 14, color: 'var(--text-primary)' }
    },
    margin: { l: 20, r: 20, t: 50, b: 20 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Source Sans Pro' },
    showlegend: true,
    legend: {
      orientation: 'v',
      x: 1.05,
      y: 0.5
    }
  };

  const pieLayout2 = {
    title: {
      text: 'Distribution of Song Count per Artist',
      font: { family: 'Source Sans Pro', size: 14, color: 'var(--text-primary)' }
    },
    margin: { l: 20, r: 20, t: 50, b: 20 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Source Sans Pro' },
    showlegend: true,
    legend: {
      orientation: 'v',
      x: 1.05,
      y: 0.5
    }
  };

  // Calculate insights
  const totalSongs = artistsPerSong.reduce((sum, item) => sum + item.value, 0);
  const soloSongs = artistsPerSong.find(item => item.name === '1 artist')?.value || 0;
  const collabSongs = totalSongs - soloSongs;

  const totalArtists = songsPerArtist.reduce((sum, item) => sum + item.value, 0);
  const oneHitWonders = songsPerArtist.find(item => item.name === '1 song')?.value || 0;
  const prolificArtists = songsPerArtist.find(item => item.name === '20+ songs')?.value || 0;

  const soloPct = totalSongs > 0 ? (soloSongs / totalSongs * 100).toFixed(1) : 0;
  const collabPct = totalSongs > 0 ? (collabSongs / totalSongs * 100).toFixed(1) : 0;
  const oneHitPct = totalArtists > 0 ? (oneHitWonders / totalArtists * 100).toFixed(1) : 0;
  const prolificPct = totalArtists > 0 ? (prolificArtists / totalArtists * 100).toFixed(1) : 0;

  const plotConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
    displaylogo: false,
    responsive: true
  };

  return (
    <ChartsContainer>
      <SectionTitle>📊 Distribution Analysis</SectionTitle>
      
      <ChartsGrid>
        <ChartContainer>
          <ChartTitle>🎵 Artists per Song Distribution</ChartTitle>
          {artistsPerSong.length > 0 ? (
            <>
              <Plot
                data={[artistsPerSongData]}
                layout={pieLayout1}
                config={plotConfig}
                style={{ width: '100%', height: '400px' }}
                useResizeHandler={true}
              />
              <InsightBox>
                <strong>📈 Collaboration Insights:</strong>
                <br />
                • Solo tracks: {soloSongs.toLocaleString()} songs ({soloPct}%)
                <br />
                • Collaborations: {collabSongs.toLocaleString()} songs ({collabPct}%)
              </InsightBox>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No artist per song data available
            </div>
          )}
        </ChartContainer>

        <ChartContainer>
          <ChartTitle>🎤 Songs per Artist Distribution</ChartTitle>
          {songsPerArtist.length > 0 ? (
            <>
              <Plot
                data={[songsPerArtistData]}
                layout={pieLayout2}
                config={plotConfig}
                style={{ width: '100%', height: '400px' }}
                useResizeHandler={true}
              />
              <InsightBox>
                <strong>🎯 Artist Activity Insights:</strong>
                <br />
                • One-hit artists: {oneHitWonders.toLocaleString()} ({oneHitPct}%)
                <br />
                • Prolific artists (20+): {prolificArtists.toLocaleString()} ({prolificPct}%)
              </InsightBox>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No songs per artist data available
            </div>
          )}
        </ChartContainer>
      </ChartsGrid>

      {artistsPerSong.length > 0 && songsPerArtist.length > 0 && (
        <CombinedChart>
          <ChartTitle>📈 Combined Distribution Analysis</ChartTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
                Artists per Song
              </h5>
              <Plot
                data={[{
                  x: artistsPerSong.map(item => item.name),
                  y: artistsPerSong.map(item => item.value),
                  type: 'bar',
                  marker: { color: '#667eea' },
                  hovertemplate: '<b>%{x}</b><br>Count: %{y}<extra></extra>'
                }]}
                layout={{
                  margin: { l: 50, r: 20, t: 20, b: 60 },
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  font: { family: 'Source Sans Pro', size: 12 },
                  xaxis: { title: 'Category' },
                  yaxis: { title: 'Count' }
                }}
                config={plotConfig}
                style={{ width: '100%', height: '300px' }}
                useResizeHandler={true}
              />
            </div>
            
            <div>
              <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>
                Songs per Artist
              </h5>
              <Plot
                data={[{
                  x: songsPerArtist.map(item => item.name),
                  y: songsPerArtist.map(item => item.value),
                  type: 'bar',
                  marker: { color: '#4facfe' },
                  hovertemplate: '<b>%{x}</b><br>Count: %{y}<extra></extra>'
                }]}
                layout={{
                  margin: { l: 50, r: 20, t: 20, b: 60 },
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  font: { family: 'Source Sans Pro', size: 12 },
                  xaxis: { title: 'Category' },
                  yaxis: { title: 'Count' }
                }}
                config={plotConfig}
                style={{ width: '100%', height: '300px' }}
                useResizeHandler={true}
              />
            </div>
          </div>
        </CombinedChart>
      )}
    </ChartsContainer>
  );
};

export default DistributionCharts;