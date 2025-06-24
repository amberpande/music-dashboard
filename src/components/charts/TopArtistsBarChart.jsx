import React from 'react';
import Plot from 'react-plotly.js';

const TopArtistsBarChart = ({ topArtists = [] }) => {
  if (!topArtists.length) {
    return <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No artist data available</div>;
  }
  const names = topArtists.map(a => a.name);
  const total = topArtists.map(a => a.song_count);
  const primary = topArtists.map(a => a.primary_count);
  const featured = topArtists.map(a => a.featured_count);

  return (
    <Plot
      data={[
        {
          x: names,
          y: primary,
          name: 'Primary',
          type: 'bar',
          marker: { color: '#667eea' },
        },
        {
          x: names,
          y: featured,
          name: 'Featured',
          type: 'bar',
          marker: { color: '#fbbf24' },
        },
      ]}
      layout={{
        barmode: 'stack',
        title: 'Top 10 Artists: Primary vs Featured Songs',
        xaxis: { title: 'Artist', tickangle: 45 },
        yaxis: { title: 'Number of Songs' },
        legend: { orientation: 'h', x: 0.5, xanchor: 'center', y: -0.2 },
        margin: { l: 60, r: 30, t: 60, b: 120 },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { family: 'Source Sans Pro' },
      }}
      config={{ displayModeBar: false, responsive: true }}
      style={{ width: '100%', height: '400px' }}
      useResizeHandler={true}
    />
  );
};

export default TopArtistsBarChart; 