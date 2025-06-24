import React from 'react';
import Plot from 'react-plotly.js';

const ArtistProductivityOverTimeChart = ({ productivityData = [] }) => {
  if (!productivityData.length) {
    return <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No productivity data available</div>;
  }
  return (
    <Plot
      data={[
        {
          x: productivityData.map(d => d.year),
          y: productivityData.map(d => d.count),
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: '#667eea' },
          line: { color: '#667eea', width: 3 },
          fill: 'tozeroy',
          fillcolor: 'rgba(102,126,234,0.1)',
        },
      ]}
      layout={{
        title: 'New Artists Added Per Year',
        xaxis: { title: 'Year' },
        yaxis: { title: 'Artists Added' },
        margin: { l: 60, r: 30, t: 60, b: 60 },
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

export default ArtistProductivityOverTimeChart; 